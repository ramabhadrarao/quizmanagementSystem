import express from 'express';
import Submission from '../models/Submission.js';
import Quiz from '../models/Quiz.js';
import { requireAuth } from '../middleware/auth.js';
import { executeCode } from '../services/codeExecution.js';

const router = express.Router();

// Submit quiz
router.post('/', requireAuth, async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(400).json({ message: 'Quiz is not published' });
    }

    // Check if user already submitted (if single attempt)
    const existingSubmission = await Submission.findOne({
      quiz: quizId,
      user: req.user.userId,
      isCompleted: true,
    });

    if (existingSubmission && quiz.allowedAttempts === 1) {
      return res.status(400).json({ message: 'You have already submitted this quiz' });
    }

    // Process answers and calculate scores
    const processedAnswers = [];
    let totalScore = 0;
    let maxScore = 0;

    for (const answer of answers) {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (!question) continue;

      maxScore += question.points;
      let score = 0;
      let isCorrect = false;
      let executionResult = null;

      if (question.type === 'multiple-choice') {
        isCorrect = question.correctAnswer === answer.answer;
        score = isCorrect ? question.points : 0;
      } else if (question.type === 'code') {
        // Execute code and check test cases
        try {
          executionResult = await executeCode(
            answer.code || '',
            question.language,
            question.testCases
          );
          
          const passedTests = executionResult.testResults.filter(t => t.passed).length;
          const totalTests = executionResult.testResults.length;
          
          if (totalTests > 0) {
            score = Math.round((passedTests / totalTests) * question.points);
            isCorrect = passedTests === totalTests;
          }
        } catch (error) {
          console.error('Code execution error:', error);
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
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
});

// Get user submissions
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
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

// Get submission details
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
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Error fetching submission' });
  }
});

export default router;