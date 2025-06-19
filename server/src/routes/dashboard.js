import express from 'express';
import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'student') {
      // Student dashboard stats
      const totalSubmissions = await Submission.countDocuments({
        user: req.user.userId,
        isCompleted: true,
      });

      const submissions = await Submission.find({
        user: req.user.userId,
        isCompleted: true,
      });

      const averageScore = submissions.length > 0
        ? submissions.reduce((sum, sub) => sum + sub.percentage, 0) / submissions.length
        : 0;

      const recentActivity = await Submission.countDocuments({
        user: req.user.userId,
        isCompleted: true,
        completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      stats = {
        totalQuizzes: await Quiz.countDocuments({ isPublished: true }),
        totalSubmissions,
        averageScore: Math.round(averageScore),
        recentActivity,
      };
    } else {
      // Instructor/Admin dashboard stats
      const quizQuery = req.user.role === 'admin' 
        ? {} 
        : { createdBy: req.user.userId };

      const totalQuizzes = await Quiz.countDocuments(quizQuery);
      
      const quizIds = await Quiz.find(quizQuery).distinct('_id');
      
      const totalSubmissions = await Submission.countDocuments({
        quiz: { $in: quizIds },
        isCompleted: true,
      });

      const submissions = await Submission.find({
        quiz: { $in: quizIds },
        isCompleted: true,
      });

      const averageScore = submissions.length > 0
        ? submissions.reduce((sum, sub) => sum + sub.percentage, 0) / submissions.length
        : 0;

      const recentActivity = await Submission.countDocuments({
        quiz: { $in: quizIds },
        isCompleted: true,
        completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      stats = {
        totalQuizzes,
        totalSubmissions,
        averageScore: Math.round(averageScore),
        recentActivity,
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Get recent activities
router.get('/activities', requireAuth, async (req, res) => {
  try {
    let activities = [];

    if (req.user.role === 'student') {
      const recentSubmissions = await Submission.find({
        user: req.user.userId,
        isCompleted: true,
      })
        .populate('quiz', 'title')
        .sort({ completedAt: -1 })
        .limit(10);

      activities = recentSubmissions.map(sub => ({
        type: 'submission',
        description: `Completed quiz: ${sub.quiz.title}`,
        score: `${sub.totalScore}/${sub.maxScore} (${sub.percentage}%)`,
        timestamp: sub.completedAt,
      }));
    } else {
      const quizQuery = req.user.role === 'admin' 
        ? {} 
        : { createdBy: req.user.userId };

      const recentQuizzes = await Quiz.find(quizQuery)
        .sort({ createdAt: -1 })
        .limit(5);

      const quizIds = await Quiz.find(quizQuery).distinct('_id');
      
      const recentSubmissions = await Submission.find({
        quiz: { $in: quizIds },
        isCompleted: true,
      })
        .populate('quiz', 'title')
        .populate('user', 'name')
        .sort({ completedAt: -1 })
        .limit(5);

      activities = [
        ...recentQuizzes.map(quiz => ({
          type: 'quiz_created',
          description: `Created quiz: ${quiz.title}`,
          status: quiz.isPublished ? 'Published' : 'Draft',
          timestamp: quiz.createdAt,
        })),
        ...recentSubmissions.map(sub => ({
          type: 'submission_received',
          description: `${sub.user.name} completed: ${sub.quiz.title}`,
          score: `${sub.totalScore}/${sub.maxScore} (${sub.percentage}%)`,
          timestamp: sub.completedAt,
        })),
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    }

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching recent activities' });
  }
});

export default router;