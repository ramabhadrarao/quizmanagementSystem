// server/src/routes/analytics.js - Analytics endpoints
import express from 'express';
import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get comprehensive analytics
router.get('/', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  try {
    const { quizId = 'all', dateRange = 'month' } = req.query;
    
    // Calculate date filter
    const now = new Date();
    let dateFilter = {};
    
    switch (dateRange) {
      case 'week':
        dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
        break;
      case 'month':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
        break;
      case 'year':
        dateFilter = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
        break;
    }

    // Build query filters
    const quizFilter = req.user.role === 'instructor' 
      ? { createdBy: req.user.userId }
      : {};
    
    if (quizId !== 'all') {
      quizFilter._id = quizId;
    }

    // Get overview statistics
    const totalQuizzes = await Quiz.countDocuments(quizFilter);
    
    const quizIds = await Quiz.find(quizFilter).distinct('_id');
    
    const submissionFilter = {
      quiz: { $in: quizIds },
      status: 'completed',
      ...(dateFilter.completedAt && { completedAt: dateFilter })
    };

    const totalSubmissions = await Submission.countDocuments(submissionFilter);
    
    const submissions = await Submission.find(submissionFilter);
    
    const totalUsers = await Submission.distinct('user', submissionFilter).length;
    
    const averageScore = submissions.length > 0
      ? submissions.reduce((sum, sub) => sum + sub.percentage, 0) / submissions.length
      : 0;
    
    const completionRate = totalSubmissions > 0
      ? (submissions.filter(s => s.isCompleted).length / totalSubmissions) * 100
      : 0;
    
    const averageTimeSpent = submissions.length > 0
      ? submissions.reduce((sum, sub) => sum + (sub.timeSpent || 0), 0) / submissions.length
      : 0;

    // Get quiz performance data
    const quizPerformance = await getQuizPerformance(quizIds, dateFilter);
    
    // Get score distribution
    const scoreDistribution = getScoreDistribution(submissions);
    
    // Get submissions over time
    const timeDistribution = await getTimeDistribution(submissionFilter, dateRange);
    
    // Get top performers
    const topPerformers = await getTopPerformers(quizIds, dateFilter);
    
    // Get recent activity
    const recentActivity = await getRecentActivity(quizIds);
    
    // Get difficulty analysis
    const difficultyAnalysis = await getDifficultyAnalysis(quizIds, dateFilter);

    res.json({
      overview: {
        totalQuizzes,
        totalSubmissions,
        totalUsers,
        averageScore: Math.round(averageScore * 10) / 10,
        completionRate: Math.round(completionRate * 10) / 10,
        averageTimeSpent: Math.round(averageTimeSpent)
      },
      quizPerformance,
      scoreDistribution,
      timeDistribution,
      topPerformers,
      recentActivity,
      difficultyAnalysis
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

// Helper functions
async function getQuizPerformance(quizIds, dateFilter) {
  const performance = [];
  
  for (const quizId of quizIds) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) continue;
    
    const submissions = await Submission.find({
      quiz: quizId,
      status: 'completed',
      ...(dateFilter.completedAt && { completedAt: dateFilter })
    });
    
    if (submissions.length === 0) continue;
    
    const avgScore = submissions.reduce((sum, sub) => sum + sub.percentage, 0) / submissions.length;
    const completionRate = (submissions.filter(s => s.isCompleted).length / submissions.length) * 100;
    const avgTime = submissions.reduce((sum, sub) => sum + (sub.timeSpent || 0), 0) / submissions.length;
    
    performance.push({
      quizId: quiz._id,
      quizTitle: quiz.title,
      submissions: submissions.length,
      averageScore: Math.round(avgScore * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      averageTime: Math.round(avgTime)
    });
  }
  
  return performance.sort((a, b) => b.submissions - a.submissions).slice(0, 10);
}

function getScoreDistribution(submissions) {
  const ranges = [
    { range: '0-20', min: 0, max: 20, count: 0 },
    { range: '21-40', min: 21, max: 40, count: 0 },
    { range: '41-60', min: 41, max: 60, count: 0 },
    { range: '61-80', min: 61, max: 80, count: 0 },
    { range: '81-100', min: 81, max: 100, count: 0 }
  ];
  
  submissions.forEach(sub => {
    const score = sub.percentage;
    const range = ranges.find(r => score >= r.min && score <= r.max);
    if (range) range.count++;
  });
  
  const total = submissions.length || 1;
  
  return ranges.map(r => ({
    range: r.range,
    count: r.count,
    percentage: Math.round((r.count / total) * 1000) / 10
  }));
}

async function getTimeDistribution(filter, dateRange) {
  const aggregation = [];
  
  // Determine grouping based on date range
  let groupBy, dateFormat;
  switch (dateRange) {
    case 'week':
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } };
      break;
    case 'month':
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } };
      break;
    case 'year':
      groupBy = { $dateToString: { format: '%Y-%m', date: '$completedAt' } };
      break;
  }
  
  const result = await Submission.aggregate([
    { $match: filter },
    {
      $group: {
        _id: groupBy,
        submissions: { $sum: 1 },
        averageScore: { $avg: '$percentage' }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 30 }
  ]);
  
  return result.map(item => ({
    date: item._id,
    submissions: item.submissions,
    averageScore: Math.round(item.averageScore * 10) / 10
  }));
}

async function getTopPerformers(quizIds, dateFilter) {
  const result = await Submission.aggregate([
    {
      $match: {
        quiz: { $in: quizIds },
        status: 'completed',
        ...(dateFilter.completedAt && { completedAt: dateFilter })
      }
    },
    {
      $group: {
        _id: '$user',
        averageScore: { $avg: '$percentage' },
        quizzesTaken: { $sum: 1 }
      }
    },
    { $sort: { averageScore: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    { $unwind: '$userInfo' }
  ]);
  
  return result.map(item => ({
    userId: item._id,
    name: item.userInfo.name,
    email: item.userInfo.email,
    averageScore: Math.round(item.averageScore * 10) / 10,
    quizzesTaken: item.quizzesTaken
  }));
}

async function getRecentActivity(quizIds) {
  const activities = [];
  
  // Get recent submissions
  const recentSubmissions = await Submission.find({
    quiz: { $in: quizIds },
    status: 'completed'
  })
    .populate('user', 'name')
    .populate('quiz', 'title')
    .sort({ completedAt: -1 })
    .limit(5);
  
  recentSubmissions.forEach(sub => {
    activities.push({
      type: 'submission',
      description: `${sub.user.name} completed ${sub.quiz.title}`,
      timestamp: sub.completedAt,
      score: sub.percentage
    });
  });
  
  // Get recently created quizzes
  const recentQuizzes = await Quiz.find({ _id: { $in: quizIds } })
    .sort({ createdAt: -1 })
    .limit(5);
  
  recentQuizzes.forEach(quiz => {
    activities.push({
      type: 'quiz_created',
      description: `New quiz "${quiz.title}" created`,
      timestamp: quiz.createdAt
    });
  });
  
  // Sort by timestamp and return top 10
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
}

async function getDifficultyAnalysis(quizIds, dateFilter) {
  const quizzes = await Quiz.find({ _id: { $in: quizIds } });
  const analysis = [];
  
  for (const quiz of quizzes) {
    for (const question of quiz.questions) {
      const submissions = await Submission.find({
        quiz: quiz._id,
        status: 'completed',
        ...(dateFilter.completedAt && { completedAt: dateFilter })
      });
      
      let correctCount = 0;
      let totalTime = 0;
      let attempts = 0;
      
      submissions.forEach(sub => {
        const answer = sub.answers.find(a => a.questionId === question._id.toString());
        if (answer) {
          attempts++;
          if (answer.isCorrect) correctCount++;
          // Estimate time spent on question (total time / number of questions)
          totalTime += (sub.timeSpent || 0) / quiz.questions.length;
        }
      });
      
      if (attempts > 0) {
        analysis.push({
          questionTitle: question.title,
          correctRate: Math.round((correctCount / attempts) * 100),
          attempts,
          averageTime: Math.round(totalTime / attempts)
        });
      }
    }
  }
  
  // Return top 10 most difficult questions
  return analysis
    .sort((a, b) => a.correctRate - b.correctRate)
    .slice(0, 10);
}

// Export analytics data
router.get('/export', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  try {
    const { format = 'csv', ...queryParams } = req.query;
    
    // Get analytics data
    const analyticsData = await getAnalyticsData(queryParams, req.user);
    
    if (format === 'csv') {
      const csv = convertToCSV(analyticsData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="analytics-report.csv"');
      res.send(csv);
    } else {
      res.json(analyticsData);
    }
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({ message: 'Error exporting analytics data' });
  }
});

function convertToCSV(data) {
  // Simple CSV conversion for overview data
  const headers = ['Metric', 'Value'];
  const rows = [
    ['Total Quizzes', data.overview.totalQuizzes],
    ['Total Submissions', data.overview.totalSubmissions],
    ['Total Users', data.overview.totalUsers],
    ['Average Score', data.overview.averageScore + '%'],
    ['Completion Rate', data.overview.completionRate + '%'],
    ['Average Time Spent', data.overview.averageTimeSpent + ' seconds']
  ];
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

async function getAnalyticsData(params, user) {
  // Reuse the main analytics logic
  const response = await fetch(`/analytics?${new URLSearchParams(params)}`, {
    headers: { user }
  });
  return response.json();
}

export default router;