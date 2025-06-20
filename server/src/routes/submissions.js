// server/src/routes/submissions.js - Additional missing routes
import express from 'express';
import Submission from '../models/Submission.js';
import Quiz from '../models/Quiz.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { queueSubmissionForGrading } from '../services/submissionQueue.js';

const router = express.Router();

// Get quiz statistics (admin/instructor only)
router.get('/quiz/:quizId/stats', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const stats = await Submission.getSubmissionStats(quizId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({ message: 'Error fetching quiz statistics' });
  }
});

// Export quiz submissions to CSV (admin/instructor only)
router.get('/quiz/:quizId/export', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const submissions = await Submission.find({
      quiz: quizId,
      status: 'completed'
    })
    .populate('user', 'name email')
    .populate('quiz', 'title')
    .sort({ completedAt: -1 });

    // Generate CSV data
    const csvHeaders = [
      'Student Name',
      'Email',
      'Total Score',
      'Max Score',
      'Percentage',
      'Time Spent (minutes)',
      'Completed At',
      'Attempt Number'
    ];

    const csvRows = submissions.map(sub => [
      sub.user.name,
      sub.user.email,
      sub.totalScore,
      sub.maxScore,
      sub.percentage,
      Math.round((sub.timeSpent || 0) / 60),
      new Date(sub.completedAt).toLocaleString(),
      sub.submissionAttempt || 1
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="quiz-${quizId}-results.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting submissions:', error);
    res.status(500).json({ message: 'Error exporting submissions' });
  }
});

// Start or resume a quiz attempt (enhanced)
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
      status: { $in: ['in_progress', 'submitted', 'processing'] },
    });

    if (submission && submission.status !== 'in_progress') {
      return res.status(400).json({ 
        message: 'You have already submitted this quiz and it is being processed or completed' 
      });
    }

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
      status: 'completed',
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
      status: 'in_progress',
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

// Auto-save answer (enhanced)
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
      status: 'in_progress',
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
    submission.answers[answerIndex].lastSaved = new Date();
    
    // Update time spent
    if (timeSpent !== undefined) {
      submission.timeSpent = timeSpent;
    }

    // Add time tracking
    submission.addTimeTracking('auto_save', submission.timeSpent);

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

// Submit quiz (enhanced with queue integration)
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

    if (submission.status === 'completed' && !forceSubmit) {
      return res.status(400).json({ message: 'Quiz already submitted' });
    }

    if (submission.status === 'processing') {
      return res.status(400).json({ message: 'Quiz is already being processed' });
    }

    // Update submission with final time and status
    submission.timeSpent = timeSpent || submission.timeSpent || 0;
    submission.status = 'submitted';
    submission.addTimeTracking('submit', submission.timeSpent);

    await submission.save();

    // Queue for processing
    const jobId = await queueSubmissionForGrading(submission._id.toString());
    submission.queueJobId = jobId;
    await submission.save();

    console.log('🔍 Quiz submitted and queued for processing:', {
      submissionId: submission._id,
      jobId
    });

    res.json({
      message: 'Quiz submitted successfully',
      submission: {
        id: submission._id,
        status: submission.status,
        timeSpent: submission.timeSpent,
        queueJobId: jobId,
      },
    });
  } catch (error) {
    console.error('🔍 Error submitting quiz:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
});

export default router;