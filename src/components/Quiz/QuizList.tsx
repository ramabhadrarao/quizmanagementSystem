import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Clock, FileText, CheckCircle, Lock, Key, Info } from 'lucide-react';
import { useQuizStore } from '../../stores/quizStore';
import { useAuthStore } from '../../stores/authStore';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { toast } from '../UI/Toaster';
import api from '../../services/api';
import QuizCodeModal from './QuizCodeModal';

const QuizList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { quizzes, fetchQuizzes, deleteQuiz, loading } = useQuizStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [showQuizCodeModal, setShowQuizCodeModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && quiz.isPublished) ||
                         (filterStatus === 'draft' && !quiz.isPublished);
    
    // For students, only show published quizzes
    if (user?.role === 'student' && !quiz.isPublished) {
      return false;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleDeleteQuiz = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteQuiz(id);
        toast.success('Quiz deleted successfully');
      } catch (error) {
        toast.error('Failed to delete quiz');
      }
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'instructor';

  const handleQuizClick = (quizId: string, userSubmission?: any) => {
    if (user?.role === 'student') {
      if (userSubmission?.status === 'completed') {
        // Navigate to results - need to get submission ID
        api.get('/submissions/my/submissions')
          .then(response => {
            const submissions = response.data.submissions || [];
            const submission = submissions.find((sub: any) => 
              sub.quiz._id === quizId || sub.quiz === quizId
            );
            if (submission) {
              navigate(`/quiz/result/${submission._id}`);
            }
          })
          .catch(error => {
            console.error('Failed to fetch submission:', error);
            toast.error('Failed to load quiz results');
          });
      } else if (userSubmission?.status === 'in_progress') {
        // Resume quiz
        navigate(`/quiz/take/${quizId}`);
      } else {
        // Show quiz code modal
        setSelectedQuizId(quizId);
        setShowQuizCodeModal(true);
      }
    } else {
      // Instructors/admins can preview directly
      navigate(`/quiz/take/${quizId}`);
    }
  };

  const handleQuizCodeSuccess = (verifiedQuizId: string) => {
    navigate(`/quiz/take/${verifiedQuizId}`);
  };

  const copyQuizCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success('Quiz code copied to clipboard!');
  };

  const getStatusBadge = (userSubmission?: any) => {
    if (!userSubmission) return null;
    
    switch (userSubmission.status) {
      case 'completed':
        return { 
          text: 'Completed', 
          color: 'bg-green-100 text-green-800', 
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'processing':
        return { 
          text: 'Processing', 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: Clock,
          iconColor: 'text-yellow-600'
        };
      case 'in_progress':
        return { 
          text: 'In Progress', 
          color: 'bg-blue-100 text-blue-800', 
          icon: Clock,
          iconColor: 'text-blue-600'
        };
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Library</h1>
          <p className="text-gray-600">
            {user?.role === 'student' 
              ? 'Browse available quizzes and track your progress'
              : 'Manage and explore all available quizzes'}
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 sm:mt-0">
          {user?.role === 'student' && (
            <Button
              onClick={() => {
                setSelectedQuizId(null);
                setShowQuizCodeModal(true);
              }}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Key className="w-5 h-5 mr-2" />
              Enter Quiz Code
            </Button>
          )}
          
          {canEdit && (
            <Link to="/quiz/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create New Quiz
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {canEdit && (
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Quizzes</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const userSubmission = quiz.userSubmission;
            const statusBadge = getStatusBadge(userSubmission);
            
            return (
              <div
                key={quiz.id}
                className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => handleQuizClick(quiz.id, userSubmission)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {quiz.description}
                    </p>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/quiz/take/${quiz.id}`);
                        }}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/quiz/edit/${quiz.id}`);
                        }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuiz(quiz.id, quiz.title);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Quiz Code Display - Only for Instructors/Admins */}
                {canEdit && quiz.quizCode && (
                  <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-between border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Code:</span>
                      <span className="font-mono font-bold text-sm text-blue-800">{quiz.quizCode}</span>
                    </div>
                    <button
                      onClick={(e) => copyQuizCode(quiz.quizCode!, e)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      Copy
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{quiz.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.timeLimit} min</span>
                  </div>
                </div>

                {/* Status for Students */}
                {user?.role === 'student' && userSubmission && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {statusBadge && (
                          <>
                            <statusBadge.icon className={`w-4 h-4 ${statusBadge.iconColor}`} />
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                              {statusBadge.text}
                            </span>
                          </>
                        )}
                        {userSubmission.status === 'completed' && userSubmission.percentage !== undefined && (
                          <span className="text-sm text-gray-600">
                            Score: {userSubmission.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* If student hasn't taken the quiz, show a hint */}
                {user?.role === 'student' && !userSubmission && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Key className="w-4 h-4" />
                      <span>Quiz code required</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      quiz.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuizClick(quiz.id, userSubmission);
                    }}
                  >
                    {user?.role === 'student' ? (
                      userSubmission?.status === 'completed' ? 'View Results' :
                      userSubmission?.status === 'in_progress' ? 'Resume' :
                      'Take Quiz'
                    ) : (
                      'Preview'
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm ? 'No quizzes found' : 'No quizzes available'}
          </h3>
          <p className="text-gray-600 mb-6">
            {user?.role === 'student' 
              ? 'Ask your instructor for a quiz code to get started'
              : searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by creating your first quiz'
            }
          </p>
          {user?.role === 'student' ? (
            <Button 
              onClick={() => {
                setSelectedQuizId(null);
                setShowQuizCodeModal(true);
              }}
            >
              <Key className="w-4 h-4 mr-2" />
              Enter Quiz Code
            </Button>
          ) : (
            !searchTerm && (
              <Link to="/quiz/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Quiz
                </Button>
              </Link>
            )
          )}
        </div>
      )}

      {/* Info Box for Students */}
      {user?.role === 'student' && filteredQuizzes.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">How to take a quiz:</p>
            <p className="text-sm text-blue-800">
              Click on any quiz card above to enter its access code. You'll need the quiz code from your instructor to start. 
              Quizzes you've already taken will show your score and allow you to view results.
            </p>
          </div>
        </div>
      )}

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

export default QuizList;