// server/src/services/submissionQueue.js - Updated with shuffle-aware grading
import Queue from 'bull';
import Redis from 'ioredis';
import Submission from '../models/Submission.js';
import Quiz from '../models/Quiz.js';
import { executeCode } from './codeExecution.js';
import { getOriginalAnswerIndex } from './questionSelection.js';

// Redis connection
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

// Create submission processing queue
const submissionQueue = new Queue('submission processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Process submissions in queue
submissionQueue.process('grade-submission', 5, async (job) => {
  const { submissionId } = job.data;
  
  console.log(`🔄 Processing submission: ${submissionId}`);
  
  try {
    const submission = await Submission.findById(submissionId).populate('quiz');
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const quiz = submission.quiz;
    let totalScore = 0;
    const processedAnswers = [];

    // Update submission status to processing
    submission.status = 'processing';
    await submission.save();

    for (let i = 0; i < submission.answers.length; i++) {
      const answer = submission.answers[i];
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      
      if (!question) {
        console.warn(`Question not found for answer: ${answer.questionId}`);
        continue;
      }

      let score = 0;
      let isCorrect = false;
      let executionResult = null;

      // Update job progress
      await job.progress((i / submission.answers.length) * 100);

      if (question.type === 'multiple-choice') {
        // Get the assignment info for this question
        const assignment = submission.assignedQuestions.find(
          aq => aq.originalQuestionId === answer.questionId
        );
        
        if (assignment?.shuffledOptionOrder) {
          // Convert the shuffled answer index back to original index
          const shuffledIndex = answer.answer;
          const originalIndex = getOriginalAnswerIndex(shuffledIndex, assignment.shuffledOptionOrder);
          isCorrect = question.correctAnswer === originalIndex;
        } else {
          // No shuffling, use direct comparison
          isCorrect = question.correctAnswer === answer.answer;
        }
        
        score = isCorrect ? question.points : 0;
      } else if (question.type === 'code') {
        // Grade code question using external service
        try {
          if (answer.code && answer.code.trim()) {
            console.log(`🧪 Executing code for question: ${question.title}`);
            
            // Call external code execution service
            executionResult = await executeCode(
              answer.code,
              question.language,
              question.testCases || []
            );
            
            // Calculate score based on test results
            if (executionResult.testResults && executionResult.testResults.length > 0) {
              const passedTests = executionResult.testResults.filter(t => t.passed).length;
              const totalTests = executionResult.testResults.length;
              
              if (totalTests > 0) {
                score = Math.round((passedTests / totalTests) * question.points);
                isCorrect = passedTests === totalTests;
              }
            }
          }
        } catch (error) {
          console.error(`Code execution error for question ${question.title}:`, error);
          executionResult = {
            error: 'Code execution failed: ' + error.message,
            testResults: question.testCases?.map(tc => ({
              passed: false,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: '',
              error: 'Execution service error'
            })) || [],
          };
        }
      }

      totalScore += score;

      processedAnswers.push({
        questionId: answer.questionId,
        type: question.type,
        answer: answer.answer,
        code: answer.code,
        isCorrect,
        score,
        executionResult,
      });
    }

    // Update submission with final results
    submission.answers = processedAnswers;
    submission.totalScore = totalScore;
    submission.status = 'completed';
    submission.completedAt = new Date();

    await submission.save();

    console.log(`✅ Submission ${submissionId} processed successfully`);
    return { submissionId, totalScore, maxScore: submission.maxScore };

  } catch (error) {
    console.error(`❌ Error processing submission ${submissionId}:`, error);
    
    // Update submission status to error
    try {
      const submission = await Submission.findById(submissionId);
      if (submission) {
        submission.status = 'error';
        submission.errorMessage = error.message;
        await submission.save();
      }
    } catch (updateError) {
      console.error('Failed to update submission error status:', updateError);
    }
    
    throw error;
  }
});

// Queue event handlers
submissionQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

submissionQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

submissionQueue.on('stalled', (job) => {
  console.warn(`⚠️ Job ${job.id} stalled`);
});

// Add submission to queue
export const queueSubmissionForGrading = async (submissionId) => {
  const job = await submissionQueue.add('grade-submission', 
    { submissionId }, 
    {
      priority: 1,
      delay: 1000, // Small delay to ensure submission is saved
    }
  );
  
  console.log(`📋 Queued submission ${submissionId} for grading (Job ID: ${job.id})`);
  return job.id;
};

// Get queue statistics
export const getQueueStats = async () => {
  const waiting = await submissionQueue.getWaiting();
  const active = await submissionQueue.getActive();
  const completed = await submissionQueue.getCompleted();
  const failed = await submissionQueue.getFailed();

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
  };
};

// Get job status
export const getJobStatus = async (jobId) => {
  const job = await submissionQueue.getJob(jobId);
  if (!job) return null;

  return {
    id: job.id,
    progress: job.progress(),
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
    failedReason: job.failedReason,
    data: job.data,
  };
};

// Clean up old jobs periodically
setInterval(async () => {
  try {
    await submissionQueue.clean(24 * 60 * 60 * 1000, 'completed'); // 24 hours
    await submissionQueue.clean(7 * 24 * 60 * 60 * 1000, 'failed'); // 7 days
  } catch (error) {
    console.error('Queue cleanup error:', error);
  }
}, 60 * 60 * 1000); // Run every hour

export default submissionQueue;