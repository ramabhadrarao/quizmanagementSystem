import React, { useEffect, useState } from 'react';
import { FileText, Users, TrendingUp, Clock, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useQuizStore } from '../../stores/quizStore';
import Button from '../UI/Button';
import api from '../../services/api';

interface DashboardStats {
  totalQuizzes: number;
  totalSubmissions: number;
  averageScore: number;
  recentActivity: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { quizzes, fetchQuizzes } = useQuizStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuizzes: 0,
    totalSubmissions: 0,
    averageScore: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    fetchQuizzes();
    // Fetch dashboard stats
    api.get('/dashboard/stats').then((response) => {
      setStats(response.data);
    }).catch(() => {
      // Fallback to basic stats
      setStats({
        totalQuizzes: quizzes.length,
        totalSubmissions: 0,
        averageScore: 0,
        recentActivity: 0,
      });
    });
  }, [fetchQuizzes, quizzes.length]);

  const statCards = [
    {
      title: 'Total Quizzes',
      value: stats.totalQuizzes,
      icon: FileText,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Submissions',
      value: stats.totalSubmissions,
      icon: Users,
      color: 'green',
      change: '+18%',
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: 'purple',
      change: '+5%',
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      icon: Clock,
      color: 'orange',
      change: '+23%',
    },
  ];

  const recentQuizzes = quizzes.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your quizzes today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Quizzes */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Quizzes</h2>
              <Link to="/quizzes">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {quiz.questions.length} questions • {quiz.timeLimit} min
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            quiz.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {quiz.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/quiz/take/${quiz.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {(user?.role === 'admin' || user?.role === 'instructor') && (
                        <Link to={`/quiz/edit/${quiz.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No quizzes yet</p>
                  {(user?.role === 'admin' || user?.role === 'instructor') && (
                    <Link to="/quiz/new">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Quiz
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-3">
              {(user?.role === 'admin' || user?.role === 'instructor') && (
                <Link to="/quiz/new" className="block">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-3" />
                    Create New Quiz
                  </Button>
                </Link>
              )}
              
              <Link to="/quizzes" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-3" />
                  Browse Quizzes
                </Button>
              </Link>
              
              <Link to="/dashboard" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  View Analytics
                </Button>
              </Link>
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-blue-800">
                Use the Monaco code editor for programming questions and enable 
                LaTeX support for mathematical formulas in your quizzes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;