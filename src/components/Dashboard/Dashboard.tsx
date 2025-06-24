import React, { useEffect, useState } from 'react';
import { FileText, Users, TrendingUp, Clock, Plus, Eye, BarChart3, Key, CheckCircle, Layers, Shuffle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useQuizStore } from '../../stores/quizStore';
import Button from '../UI/Button';
import api from '../../services/api';
import QuizCodeModal from '../Quiz/QuizCodeModal';

interface DashboardStats {
  totalQuizzes: number;
  totalSubmissions: number;
  averageScore: number;
  recentActivity: number;
}

interface RecentActivity {
  type: string;
  description: string;
  score?: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { quizzes, fetchQuizzes } = useQuizStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuizzes: 0,
    totalSubmissions: 0,
    averageScore: 0,
    recentActivity: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [showQuizCodeModal, setShowQuizCodeModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
    fetchDashboardData();
  }, [fetchQuizzes]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      setLoadingStats(true);
      const statsResponse = await api.get('/dashboard/stats');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Set default values if API fails
      setStats({
        totalQuizzes: quizzes.length,
        totalSubmissions: 0,
        averageScore: 0,
        recentActivity: 0,
      });
    } finally {
      setLoadingStats(false);
    }

    try {
      // Fetch activities
      setLoadingActivities(true);
      const activitiesResponse = await api.get('/dashboard/activities');
      setActivities(activitiesResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Helper function to calculate actual question count based on pool configuration
  const getActualQuestionCount = (quiz: any) => {
    if (!quiz.questionPoolConfig?.enabled) {
      return quiz.questions.length;
    }

    // Calculate actual questions from pool
    const mcqCount = quiz.questions.filter((q: any) => q.type === 'multiple-choice').length;
    const codeCount = quiz.questions.filter((q: any) => q.type === 'code').length;

    const actualMcqCount = quiz.questionPoolConfig.multipleChoiceCount > 0 
      ? Math.min(quiz.questionPoolConfig.multipleChoiceCount, mcqCount)
      : mcqCount;

    const actualCodeCount = quiz.questionPoolConfig.codeCount > 0
      ? Math.min(quiz.questionPoolConfig.codeCount, codeCount)
      : codeCount;

    return actualMcqCount + actualCodeCount;
  };

  // Helper function to get pool info text
  const getPoolInfoText = (quiz: any) => {
    if (!quiz.questionPoolConfig?.enabled) {
      return null;
    }

    const totalQuestions = quiz.questions.length;
    const actualQuestions = getActualQuestionCount(quiz);

    if (totalQuestions === actualQuestions) {
      return null; // No selection happening
    }

    return `${actualQuestions} from ${totalQuestions}`;
  };

  const handleQuizClick = async (quizId: string, userSubmission?: any) => {
    if (user?.role === 'student') {
      if (userSubmission?.status === 'completed') {
        // Need to fetch the actual submission ID
        try {
          const response = await api.get('/submissions/my/submissions');
          const submissions = response.data.submissions || [];
          const submission = submissions.find((sub: any) => 
            (sub.quiz._id === quizId || sub.quiz === quizId) && sub.status === 'completed'
          );
          
          if (submission) {
            navigate(`/quiz/result/${submission._id}`);
          } else {
            console.error('Could not find submission for completed quiz');
          }
        } catch (error) {
          console.error('Failed to fetch submission:', error);
        }
      } else if (userSubmission?.status === 'in_progress') {
        // If in progress, resume
        navigate(`/quiz/take/${quizId}`);
      } else {
        // If not started, ask for quiz code
        setSelectedQuizId(quizId);
        setShowQuizCodeModal(true);
      }
    } else {
      // For instructors/admins, go directly to preview
      navigate(`/quiz/take/${quizId}`);
    }
  };

  const handleQuizCodeSuccess = (verifiedQuizId: string) => {
    // Verify that the entered code matches the selected quiz
    if (verifiedQuizId === selectedQuizId) {
      navigate(`/quiz/take/${verifiedQuizId}`);
    } else {
      // This shouldn't happen, but handle it gracefully
      navigate(`/quiz/take/${verifiedQuizId}`);
    }
  };

  const statCards = [
    {
      title: 'Total Quizzes',
      value: stats.totalQuizzes,
      icon: FileText,
      color: 'blue',
      change: user?.role === 'student' ? null : '+12%',
    },
    {
      title: user?.role === 'student' ? 'My Submissions' : 'Total Submissions',
      value: stats.totalSubmissions,
      icon: Users,
      color: 'green',
      change: stats.totalSubmissions > 0 ? '+18%' : null,
    },
    {
      title: 'Average Score',
      value: stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A',
      icon: TrendingUp,
      color: 'purple',
      change: stats.averageScore > 0 ? '+5%' : null,
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      icon: Clock,
      color: 'orange',
      change: stats.recentActivity > 0 ? '+23%' : null,
    },
  ];

  const availableQuizzes = quizzes.filter(quiz => quiz.isPublished);
  const canEdit = user?.role === 'admin' || user?.role === 'instructor';
  const canViewAnalytics = user?.role === 'admin' || user?.role === 'instructor';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {user?.role === 'student' 
            ? "Track your progress and take new quizzes"
            : "Here's what's happening with your quizzes today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const bgColor = `bg-${stat.color}-100`;
          const iconColor = `text-${stat.color}-600`;
          
          return (
            <div
              key={stat.title}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                {stat.change && (
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {loadingStats ? (
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  stat.value
                )}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Quizzes / Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.role === 'student' ? 'Available Quizzes' : 'Recent Activity'}
              </h2>
              <Link to="/quizzes">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {user?.role === 'student' ? (
              // Show available quizzes for students
              <div className="space-y-4">
                {availableQuizzes.length > 0 ? (
                  availableQuizzes.slice(0, 5).map((quiz) => {
                    const userSubmission = quiz.userSubmission;
                    const isCompleted = userSubmission?.status === 'completed';
                    const isInProgress = userSubmission?.status === 'in_progress';
                    const actualQuestionCount = getActualQuestionCount(quiz);
                    const poolInfo = getPoolInfoText(quiz);
                    
                    return (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleQuizClick(quiz.id, userSubmission)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {quiz.title}
                            </h3>
                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                            {(quiz.questionPoolConfig?.enabled || quiz.shuffleConfig?.shuffleQuestions) && (
                              <div className="flex items-center gap-1">
                                {quiz.questionPoolConfig?.enabled && (
                                  <span className="inline-flex items-center p-1 bg-purple-100 rounded" title="Question Pool">
                                    <Layers className="w-3 h-3 text-purple-600" />
                                  </span>
                                )}
                                {quiz.shuffleConfig?.shuffleQuestions && (
                                  <span className="inline-flex items-center p-1 bg-blue-100 rounded" title="Randomized">
                                    <Shuffle className="w-3 h-3 text-blue-600" />
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {actualQuestionCount} questions
                            {poolInfo && <span className="text-blue-600"> ({poolInfo})</span>}
                            {' • '}{quiz.timeLimit} min
                            {isCompleted && ` • Score: ${userSubmission.percentage}%`}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuizClick(quiz.id, userSubmission);
                          }}
                        >
                          {isCompleted ? 'View Results' : isInProgress ? 'Resume' : 'Take Quiz'}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No quizzes available yet</p>
                    <p className="text-sm text-gray-400 mt-2">Ask your instructor for a quiz code</p>
                  </div>
                )}
              </div>
            ) : (
              // Show recent activity for instructors/admins
              <div className="space-y-4">
                {loadingActivities ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {activity.score && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {activity.score}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No recent activity</p>
                    {canEdit && (
                      <Link to="/quiz/new">
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Quiz
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-3">
              {user?.role === 'student' && (
                <Button
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedQuizId(null);
                    setShowQuizCodeModal(true);
                  }}
                >
                  <Key className="w-4 h-4 mr-3" />
                  Enter Quiz Code
                </Button>
              )}
              
              {canEdit && (
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
              
              {canViewAnalytics && (
                <Link to="/analytics" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-3" />
                    View Analytics
                  </Button>
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link to="/admin" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-3" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-blue-800">
                {user?.role === 'student' 
                  ? 'Look for the pool and shuffle icons to see which quizzes have randomized questions!'
                  : 'Use question pools and shuffling to create unique quiz experiences for each student.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Code Modal */}
      <QuizCodeModal
        isOpen={showQuizCodeModal}
        onClose={() => {
          setShowQuizCodeModal(false);
          setSelectedQuizId(null);
        }}
        onSuccess={handleQuizCodeSuccess}
      />
    </div>
  );
};

export default Dashboard;