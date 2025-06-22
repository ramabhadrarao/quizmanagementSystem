// src/components/Analytics/Analytics.tsx - Comprehensive Analytics Dashboard
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  Users,
  Award,
  Clock,
  FileText,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChartIcon,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import api from '../../services/api';
import Button from '../UI/Button';
import { toast } from '../UI/Toaster';

interface AnalyticsData {
  overview: {
    totalQuizzes: number;
    totalSubmissions: number;
    totalUsers: number;
    averageScore: number;
    completionRate: number;
    averageTimeSpent: number;
  };
  quizPerformance: Array<{
    quizId: string;
    quizTitle: string;
    submissions: number;
    averageScore: number;
    completionRate: number;
    averageTime: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  timeDistribution: Array<{
    date: string;
    submissions: number;
    averageScore: number;
  }>;
  topPerformers: Array<{
    userId: string;
    name: string;
    email: string;
    averageScore: number;
    quizzesTaken: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    score?: number;
  }>;
  difficultyAnalysis: Array<{
    questionTitle: string;
    correctRate: number;
    attempts: number;
    averageTime: number;
  }>;
}

const Analytics: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'students' | 'questions'>('overview');

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'instructor') {
      fetchAnalytics();
    }
  }, [user, selectedQuiz, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        quizId: selectedQuiz,
        dateRange: dateRange
      });
      
      const response = await api.get(`/analytics?${params}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
      // Set mock data for demonstration
      setMockAnalytics();
    } finally {
      setLoading(false);
    }
  };

  const setMockAnalytics = () => {
    // Mock data for demonstration
    setAnalytics({
      overview: {
        totalQuizzes: 12,
        totalSubmissions: 156,
        totalUsers: 45,
        averageScore: 78.5,
        completionRate: 92.3,
        averageTimeSpent: 1800 // 30 minutes in seconds
      },
      quizPerformance: [
        { quizId: '1', quizTitle: 'JavaScript Fundamentals', submissions: 45, averageScore: 82, completionRate: 95, averageTime: 1500 },
        { quizId: '2', quizTitle: 'React Advanced Concepts', submissions: 38, averageScore: 75, completionRate: 89, averageTime: 2100 },
        { quizId: '3', quizTitle: 'Python Basics', submissions: 52, averageScore: 88, completionRate: 97, averageTime: 1200 },
        { quizId: '4', quizTitle: 'Data Structures', submissions: 21, averageScore: 65, completionRate: 85, averageTime: 2400 }
      ],
      scoreDistribution: [
        { range: '0-20', count: 5, percentage: 3.2 },
        { range: '21-40', count: 12, percentage: 7.7 },
        { range: '41-60', count: 28, percentage: 17.9 },
        { range: '61-80', count: 65, percentage: 41.7 },
        { range: '81-100', count: 46, percentage: 29.5 }
      ],
      timeDistribution: [
        { date: '2024-01-01', submissions: 12, averageScore: 75 },
        { date: '2024-01-02', submissions: 18, averageScore: 78 },
        { date: '2024-01-03', submissions: 15, averageScore: 82 },
        { date: '2024-01-04', submissions: 22, averageScore: 80 },
        { date: '2024-01-05', submissions: 20, averageScore: 85 },
        { date: '2024-01-06', submissions: 16, averageScore: 79 },
        { date: '2024-01-07', submissions: 25, averageScore: 83 }
      ],
      topPerformers: [
        { userId: '1', name: 'Alice Johnson', email: 'alice@example.com', averageScore: 95.5, quizzesTaken: 8 },
        { userId: '2', name: 'Bob Smith', email: 'bob@example.com', averageScore: 92.3, quizzesTaken: 7 },
        { userId: '3', name: 'Carol Davis', email: 'carol@example.com', averageScore: 89.7, quizzesTaken: 9 },
        { userId: '4', name: 'David Wilson', email: 'david@example.com', averageScore: 87.2, quizzesTaken: 6 },
        { userId: '5', name: 'Eve Brown', email: 'eve@example.com', averageScore: 85.8, quizzesTaken: 8 }
      ],
      recentActivity: [
        { type: 'submission', description: 'John Doe completed JavaScript Fundamentals', timestamp: '2024-01-07T10:30:00Z', score: 85 },
        { type: 'quiz_created', description: 'New quiz "Advanced React Patterns" created', timestamp: '2024-01-07T09:15:00Z' },
        { type: 'submission', description: 'Jane Smith completed Python Basics', timestamp: '2024-01-07T08:45:00Z', score: 92 }
      ],
      difficultyAnalysis: [
        { questionTitle: 'What is closure in JavaScript?', correctRate: 45, attempts: 120, averageTime: 180 },
        { questionTitle: 'Implement binary search', correctRate: 38, attempts: 85, averageTime: 300 },
        { questionTitle: 'React hooks usage', correctRate: 72, attempts: 95, averageTime: 120 },
        { questionTitle: 'Python list comprehension', correctRate: 85, attempts: 110, averageTime: 90 }
      ]
    });
  };

  const downloadReport = () => {
    // In a real implementation, this would generate and download a PDF/CSV report
    toast.success('Report download started');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (user?.role !== 'admin' && user?.role !== 'instructor') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600">Analytics are only available for instructors and administrators.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h1>
          <p className="text-gray-600">Analytics data is not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">
              Track performance, identify trends, and improve your quizzes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchAnalytics}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={downloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Filter
            </label>
            <select
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Quizzes</option>
              {analytics.quizPerformance.map((quiz) => (
                <option key={quiz.quizId} value={quiz.quizId}>
                  {quiz.quizTitle}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'year')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'performance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Performance
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'students'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Students
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'questions'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Questions
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.overview.totalQuizzes}
              </h3>
              <p className="text-gray-600 text-sm">Total Quizzes</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.overview.totalSubmissions}
              </h3>
              <p className="text-gray-600 text-sm">Total Submissions</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  +5.2%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {analytics.overview.averageScore.toFixed(1)}%
              </h3>
              <p className="text-gray-600 text-sm">Average Score</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(analytics.overview.averageTimeSpent)}
              </h3>
              <p className="text-gray-600 text-sm">Avg. Time Spent</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Score Distribution */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percentage }) => `${range}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Submissions Over Time */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submissions Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.timeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="submissions"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.type === 'submission' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {activity.score && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {activity.score}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-8">
          {/* Quiz Performance Comparison */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.quizPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quizTitle" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageScore" fill="#3B82F6" name="Average Score" />
                <Bar dataKey="completionRate" fill="#10B981" name="Completion Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Average Score Trend */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Score Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.timeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Completion Rate by Quiz */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rates</h3>
              <div className="space-y-4">
                {analytics.quizPerformance.map((quiz) => (
                  <div key={quiz.quizId}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{quiz.quizTitle}</span>
                      <span className="text-sm text-gray-600">{quiz.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${quiz.completionRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-8">
          {/* Top Performers */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Avg Score</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Quizzes Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topPerformers.map((student, index) => (
                    <tr key={student.userId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                      <td className="py-3 px-4 text-gray-600">{student.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {student.averageScore.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-700">{student.quizzesTaken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Performance Distribution */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[
                { subject: 'Participation', A: 120, fullMark: 150 },
                { subject: 'Average Score', A: 98, fullMark: 100 },
                { subject: 'Completion Rate', A: 86, fullMark: 100 },
                { subject: 'Time Efficiency', A: 99, fullMark: 100 },
                { subject: 'Consistency', A: 85, fullMark: 100 }
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Performance" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-8">
          {/* Difficulty Analysis */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Difficulty Analysis</h3>
            <div className="space-y-4">
              {analytics.difficultyAnalysis.map((question, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{question.questionTitle}</h4>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.correctRate >= 70 ? 'bg-green-100 text-green-800' :
                        question.correctRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.correctRate}% Correct
                      </span>
                      <span className="text-sm text-gray-600">
                        {question.attempts} attempts
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            question.correctRate >= 70 ? 'bg-green-600' :
                            question.correctRate >= 50 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${question.correctRate}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Time: {formatTime(question.averageTime)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Performance Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Performance Overview</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.difficultyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="questionTitle" angle={-45} textAnchor="end" height={150} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="correctRate" fill="#10B981" name="Success Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;