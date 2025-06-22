// src/components/Quiz/QuizList.tsx - Complete updated version with submission status
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Clock, FileText, CheckCircle, Lock } from 'lucide-react';
import { useQuizStore } from '../../stores/quizStore';
import { useAuthStore } from '../../stores/authStore';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { toast } from '../UI/Toaster';
import api from '../../services/api';

const QuizList: React.FC = () => {
  const { user } = useAuthStore();
  const { quizzes, fetchQuizzes, deleteQuiz, loading } = useQuizStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [userSubmissions, setUserSubmissions] = useState<Record<string, any>>({});
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    fetchQuizzes();
    if (user?.role === 'student') {
      fetchUserSubmissions();
    }
  }, [fetchQuizzes, user]);

  const fetchUserSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const response = await api.get('/submissions/my/submissions?limit=100');
      const submissions = response.data.submissions || [];
      const submissionMap: Record<string, any> = {};
      
      submissions.forEach((sub: any) => {
        if (sub.quiz && sub.quiz._id) {
          submissionMap[sub.quiz._id] = {
            id: sub._id,
            status: sub.status,
            percentage: sub.percentage,
            completedAt: sub.completedAt,
            totalScore: sub.totalScore,
            maxScore: sub.maxScore,
          };
        }
      });
      
      setUserSubmissions(submissionMap);
    } catch (error) {
      console.error('Failed to fetch user submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && quiz.isPublished) ||
                         (filterStatus === 'draft' && !quiz.isPublished);
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

  const getQuizStatus = (quizId: string) => {
    const submission = userSubmissions[quizId];
    if (!submission) return null;
    
    return {
      taken: true,
      status: submission.status,
      score: submission.percentage,
      submissionId: submission.id,
      totalScore: submission.totalScore,
      maxScore: submission.maxScore,
    };
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', color: 'bg-green-100 text-green-800' };
      case 'processing':
        return { text: 'Processing', color: 'bg-yellow-100 text-yellow-800' };
      case 'in_progress':
        return { text: 'In Progress', color: 'bg-blue-100 text-blue-800' };
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
            Manage and explore all available quizzes
          </p>
        </div>
        
        {canEdit && (
          <Link to="/quiz/new">
            <Button size="lg" className="mt-4 sm:mt-0">
              <Plus className="w-5 h-5 mr-2" />
              Create New Quiz
            </Button>
          </Link>
        )}
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
        </div>
      </div>

      {/* Quiz Grid */}
      {loading || loadingSubmissions ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const quizStatus = getQuizStatus(quiz.id);
            const statusBadge = quizStatus ? getStatusBadge(quizStatus.status) : null;
            
            return (
              <div
                key={quiz.id}
                className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group"
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
                  <div className="flex items-center gap-1 ml-2">
                    {canEdit ? (
                      <>
                        <Link to={`/quiz/take/${quiz.id}`}>
                          <Button variant="ghost" size="sm" title="Preview">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/quiz/edit/${quiz.id}`}>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : quizStatus?.taken && quizStatus.status === 'completed' ? (
                      <Link to={`/quiz/result/${quizStatus.submissionId}`}>
                        <Button variant="ghost" size="sm" title="View Results">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </div>

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

                {/* Status and Score for Students */}
                {user?.role === 'student' && quizStatus?.taken && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {statusBadge && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                            {statusBadge.text}
                          </span>
                        )}
                        {quizStatus.status === 'completed' && (
                          <span className="text-sm text-gray-600">
                            Score: {quizStatus.score}%
                          </span>
                        )}
                      </div>
                      {quizStatus.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
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
                  
                  {user?.role === 'student' ? (
                    <>
                      {quizStatus?.taken ? (
                        quizStatus.status === 'completed' ? (
                          <div className="flex items-center gap-2">
                            <Link to={`/quiz/result/${quizStatus.submissionId}`}>
                              <Button variant="outline" size="sm">
                                View Results
                              </Button>
                            </Link>
                          </div>
                        ) : quizStatus.status === 'in_progress' ? (
                          <Link to={`/quiz/take/${quiz.id}`}>
                            <Button variant="outline" size="sm">
                              Resume Quiz
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <Lock className="w-3 h-3 mr-1" />
                            Processing
                          </Button>
                        )
                      ) : (
                        <Link to={`/quiz/take/${quiz.id}`}>
                          <Button variant="outline" size="sm">
                            Take Quiz
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link to={`/quiz/take/${quiz.id}`}>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No quizzes found' : 'No quizzes yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search terms or filters'
              : 'Get started by creating your first quiz'
            }
          </p>
          {canEdit && !searchTerm && filterStatus === 'all' && (
            <Link to="/quiz/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Quiz
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizList;