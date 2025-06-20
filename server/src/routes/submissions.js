// server/src/routes/submissions.js - Enhanced with auto-save and resume
import express from 'express';
import Submission from '../models/Submission.js';
import Quiz from '../models/Quiz.js';
import { requireAuth } from '../middleware/auth.js';
import { executeCode } from '../services/codeExecution.js';

const router = express.Router();

// Start or resume a quiz attempt
router.post('/start', requireAuth, async (req, res) => {
  try {
    const { quizId } = req.body;
    
    console.log('🔍 Starting/resuming quiz attempt:', { quizId, userId: req.user.userId });
    
    if (!quizId) {
      return res.status(400).json({ message: 'Quiz ID is required' });
    }
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(400).json({ message: 'Quiz is not published' });
    }

    // Check for existing in-progress submission
    let submission = await Submission.findOne({
      quiz: quizId,
      user: req.user.userId,
      isCompleted: false,
    });

    if (submission) {
      console.log('🔍 Found existing in-progress submission');
      // Resume existing attempt
      return res.json({
        message: 'Resuming existing attempt',
        submission: {
          id: submission._id,
          startedAt: submission.startedAt,
          answers: submission.answers,
          timeSpent: submission.timeSpent || 0,
          isResuming: true,
        },
      });
    }

    // Check if user already completed this quiz (if single attempt)
    const completedSubmission = await Submission.findOne({
      quiz: quizId,
      user: req.user.userId,
      isCompleted: true,
    });

    if (completedSubmission && quiz.allowedAttempts === 1) {
      return res.status(400).json({ message: 'You have already completed this quiz' });
    }

    // Create new submission
    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    
    submission = new Submission({
      quiz: quizId,
      user: req.user.userId,
      answers: quiz.questions.map((question, index) => ({
        questionId: question._id.toString(),
        type: question.type,
        answer: question.type === 'multiple-choice' ? -1 : '',
        code: question.type === 'code' ? '' : undefined,
        isCorrect: false,
        score: 0,
      })),
      totalScore: 0,
      maxScore,
      timeSpent: 0,
      isCompleted: false,
    });

    await submission.save();
    console.log('🔍 Created new submission:', submission._id);

    res.status(201).json({
      message: 'Quiz attempt started',
      submission: {
        id: submission._id,
        startedAt: submission.startedAt,
        answers: submission.answers,
        timeSpent: 0,
        isResuming: false,
      },
    });
  } catch (error) {
    console.error('🔍 Error starting quiz:', error);
    res.status(500).json({ message: 'Error starting quiz attempt' });
  }
});

// Auto-save answer (called immediately when user answers)
router.post('/save-answer', requireAuth, async (req, res) => {
  try {
    const { submissionId, questionId, answer, code, timeSpent } = req.body;
    
    console.log('🔍 Auto-saving answer:', { 
      submissionId, 
      questionId, 
      answer: typeof answer === 'string' ? answer.substring(0, 100) + '...' : answer,
      hasCode: !!code,
      timeSpent 
    });
    
    if (!submissionId || !questionId) {
      return res.status(400).json({ message: 'Submission ID and Question ID are required' });
    }

    const submission = await Submission.findOne({
      _id: submissionId,
      user: req.user.userId,
      isCompleted: false,
    });

    if (!submission) {
      return res.status(404).json({ message: 'Active submission not found' });
    }

    // Update the specific answer
    const answerIndex = submission.answers.findIndex(a => a.questionId === questionId);
    
    if (answerIndex === -1) {
      return res.status(400).json({ message: 'Question not found in submission' });
    }

    // Update answer data
    submission.answers[answerIndex].answer = answer;
    if (code !== undefined) {
      submission.answers[answerIndex].code = code;
    }
    
    // Update time spent
    if (timeSpent !== undefined) {
      submission.timeSpent = timeSpent;
    }

    // Mark as modified for mongoose
    submission.markModified('answers');
    await submission.save();

    console.log('🔍 Answer auto-saved successfully');
    
    res.json({
      message: 'Answer saved',
      saved: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('🔍 Error auto-saving answer:', error);
    res.status(500).json({ message: 'Error saving answer' });
  }
});

// Submit quiz (final submission with grading)
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const { submissionId, timeSpent, forceSubmit } = req.body;
    
    console.log('🔍 Submitting quiz:', { submissionId, timeSpent, forceSubmit, userId: req.user.userId });
    
    if (!submissionId) {
      return res.status(400).json({ message: 'Submission ID is required' });
    }

    const submission = await Submission.findOne({
      _id: submissionId,
      user: req.user.userId,
    }).populate('quiz');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.isCompleted && !forceSubmit) {
      return res.status(400).json({ message: 'Quiz already submitted' });
    }

    const quiz = submission.quiz;
    console.log('🔍 Processing submission for quiz:', quiz.title);

    // Process answers and calculate scores
    let totalScore = 0;
    const processedAnswers = [];

    for (let i = 0; i < submission.answers.length; i++) {
      const answer = submission.answers[i];
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      
      if (!question) {
        console.warn('🔍 Question not found for answer:', answer.questionId);
        continue;
      }

      let score = 0;
      let isCorrect = false;
      let executionResult = null;

      if (question.type === 'multiple-choice') {
        isCorrect = question.correctAnswer === answer.answer;
        score = isCorrect ? question.points : 0;
      } else if (question.type === 'code') {
        // Execute code and check test cases
        try {
          if (answer.code && answer.code.trim()) {
            console.log('🔍 Executing code for question:', question.title);
            executionResult = await executeCode(
              answer.code,
              question.language,
              question.testCases || []
            );
            
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
          console.error('🔍 Code execution error for question:', question.title, error);
          executionResult = {
            error: 'Code execution failed: ' + error.message,
            testResults: [],
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
    submission.timeSpent = timeSpent || submission.timeSpent || 0;
    submission.completedAt = new Date();
    submission.isCompleted = true;

    await submission.save();

    console.log('🔍 Quiz submitted successfully:', {
      submissionId: submission._id,
      totalScore,
      maxScore: submission.maxScore,
      percentage: submission.percentage
    });

    res.json({
      message: 'Quiz submitted successfully',
      submission: {
        id: submission._id,
        totalScore,
        maxScore: submission.maxScore,
        percentage: submission.percentage,
        completedAt: submission.completedAt,
        answers: processedAnswers,
      },
    });
  } catch (error) {
    console.error('🔍 Error submitting quiz:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
});

// Get current submission status
router.get('/status/:quizId', requireAuth, async (req, res) => {
  try {
    const { quizId } = req.params;
    
    console.log('🔍 Getting submission status:', { quizId, userId: req.user.userId });
    
    // Look for in-progress submission
    const inProgressSubmission = await Submission.findOne({
      quiz: quizId,
      user: req.user.userId,
      isCompleted: false,
    });

    if (inProgressSubmission) {
      return res.json({
        hasInProgress: true,
        submission: {
          id: inProgressSubmission._id,
          startedAt: inProgressSubmission.startedAt,
          timeSpent: inProgressSubmission.timeSpent || 0,
          answers: inProgressSubmission.answers,
        },
      });
    }

    // Check for completed submissions
    const completedSubmissions = await Submission.find({
      quiz: quizId,
      user: req.user.userId,
      isCompleted: true,
    }).sort({ completedAt: -1 });

    res.json({
      hasInProgress: false,
      completedAttempts: completedSubmissions.length,
      lastAttempt: completedSubmissions[0] || null,
    });
  } catch (error) {
    console.error('🔍 Error getting submission status:', error);
    res.status(500).json({ message: 'Error getting submission status' });
  }
});

// Get user submissions (existing route - keep as is)
router.get('/my', requireAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.userId,
      isCompleted: true,
    })
      .populate('quiz', 'title description timeLimit')
      .sort({ completedAt: -1 });

    res.json(submissions.map(sub => ({
      id: sub._id,
      quiz: {
        id: sub.quiz._id,
        title: sub.quiz.title,
        description: sub.quiz.description,
      },
      totalScore: sub.totalScore,
      maxScore: sub.maxScore,
      percentage: sub.percentage,
      completedAt: sub.completedAt,
    })));
  } catch (error) {
    console.error('🔍 Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

// Get submission details (existing route - keep as is)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('quiz')
      .populate('user', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && submission.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(submission);
  } catch (error) {
    console.error('🔍 Error fetching submission:', error);
    res.status(500).json({ message: 'Error fetching submission' });
  }
});

// Legacy route (for backward compatibility) - convert to new system
router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('🔍 Legacy submission route called - redirecting to new system');
    
    const { quizId, answers } = req.body;
    
    if (!quizId || !answers) {
      return res.status(400).json({ 
        message: 'Please use the new submission system. Start quiz first with /start endpoint.' 
      });
    }

    // For backward compatibility, create and submit in one go
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check for existing completed submission
    const existingSubmission = await Submission.findOne({
      quiz: quizId,
      user: req.user.userId,
      isCompleted: true,
    });

    if (existingSubmission && quiz.allowedAttempts === 1) {
      return res.status(400).json({ message: 'You have already submitted this quiz' });
    }

    // Create and process submission immediately
    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    let totalScore = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) continue;

      let score = 0;
      let isCorrect = false;
      let executionResult = null;

      if (question.type === 'multiple-choice') {
        isCorrect = question.correctAnswer === answer.answer;
        score = isCorrect ? question.points : 0;
      } else if (question.type === 'code') {
        try {
          if (answer.code && answer.code.trim()) {
            executionResult = await executeCode(
              answer.code,
              question.language,
              question.testCases || []
            );
            
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
          console.error('🔍 Code execution error:', error);
          executionResult = {
            error: 'Code execution failed',
            testResults: [],
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

    // Create submission
    const submission = new Submission({
      quiz: quizId,
      user: req.user.userId,
      answers: processedAnswers,
      totalScore,
      maxScore,
      completedAt: new Date(),
      isCompleted: true,
    });

    await submission.save();

    res.status(201).json({
      message: 'Quiz submitted successfully',
      submission: {
        id: submission._id,
        totalScore,
        maxScore,
        percentage: submission.percentage,
        answers: processedAnswers,
      },
    });
  } catch (error) {
    console.error('🔍 Legacy submission error:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
});

export default router;