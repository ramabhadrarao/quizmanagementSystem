import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  Award, 
  TrendingUp, 
  Eye, 
  Trash2, 
  RefreshCw,
  Download,
  Search,
  Filter,
  RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

interface QuizSubmission {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  quiz: {
    id: string;
    title: string;
  };
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
  status: 'completed' | 'processing' | 'error';
  canRetake: boolean;
}

interface QuizStats {
  totalSubmissions: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  averageTime: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>('');
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchQuizzes();
    }
  }, [user]);

  useEffect(() => {
    if (selectedQuiz) {
      fetchSubmissions();
      fetchQuizStats();
    }
  }, [selectedQuiz, currentPage, statusFilter]);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quizzes');
      const quizData = response.data.quizzes || response.data;
      setQuizzes(Array.isArray(quizData) ? quizData : []);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };

  const fetchSubmissions = async () => {
    if (!selectedQuiz) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await api.get(`/submissions/quiz/${selectedQuiz}/all?${params}`);
      setSubmissions(response.data.submissions || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizStats = async () => {
    if (!selectedQuiz) return;
    
    try {
      const response = await api.get(`/submissions/quiz/${selectedQuiz}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch quiz stats:', error);
      setStats(null);
    }
  };

  const handleDeleteSubmission = async (submissionId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}'s submission? This will allow them to retake the quiz.`)) {
      return;
    }

    try {
      await api.delete(`/submissions/${submissionId}`);
      fetchSubmissions();
      fetchQuizStats();
      // Show success message
      alert('Submission deleted successfully. Student can now retake the quiz.');
    } catch (error) {
      console.error('Failed to delete submission:', error);
      alert('Failed to delete submission. Please try again.');
    }
  };

  const handleAllowRetake = async (submissionId: string, userName: string) => {
    if (!window.confirm(`Allow ${userName} to retake this quiz?`)) {
      return;
    }

    try {
      await api.post(`/submissions/${submissionId}/allow-retake`);
      fetchSubmissions();
      alert('Student can now retake the quiz.');
    } catch (error) {
      console.error('Failed to allow retake:', error);
      alert('Failed to allow retake. Please try again.');
    }
  };

  const exportSubmissions = async () => {
    if (!selectedQuiz) return;

    try {
      const response = await api.get(`/submissions/quiz/${selectedQuiz}/export`, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quiz-submissions-${selectedQuiz}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export submissions:', error);
      alert('Failed to export submissions. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredSubmissions = submissions.filter(submission => 
    submission.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard - Quiz Results
        </h1>
        <p className="text-gray-600">
          Manage quiz submissions and student results
        </p>
      </div>

      {/* Quiz Selection */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Quiz</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedQuiz}
            onChange={(e) => {
              setSelectedQuiz(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a quiz to view results...</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title} ({quiz.isPublished ? 'Published' : 'Draft'})
              </option>
            ))}
          </select>
          
          {selectedQuiz && (
            <button
              onClick={exportSubmissions}
              className="inline-flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {selectedQuiz && stats && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</h3>
              <p className="text-sm text-gray-600">Total Submissions</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{Math.round(stats.averageScore)}%</h3>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{Math.round(stats.maxScore)}%</h3>
              <p className="text-sm text-gray-600">Highest Score</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-red-600 transform rotate-180" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{Math.round(stats.minScore)}%</h3>
              <p className="text-sm text-gray-600">Lowest Score</p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatTime(Math.round(stats.averageTime))}</h3>
              <p className="text-sm text-gray-600">Avg Time</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="error">Error</option>
              </select>
              
              <button
                onClick={fetchSubmissions}
                disabled={loading}
                className="inline-flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Quiz Submissions ({filteredSubmissions.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {submission.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(submission.percentage)}`}>
                              {submission.percentage}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              ({submission.totalScore}/{submission.maxScore})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(submission.timeSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(submission.completedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                            submission.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => window.open(`/quiz/result/${submission.id}`, '_blank')}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="View Results"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {!submission.canRetake && (
                              <button
                                onClick={() => handleAllowRetake(submission.id, submission.user.name)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Allow Retake"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteSubmission(submission.id, submission.user.name)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Found</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'No submissions match your search criteria.' 
                    : 'No students have submitted this quiz yet.'
                  }
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedQuiz && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Select a Quiz to View Results
          </h3>
          <p className="text-gray-600">
            Choose a quiz from the dropdown above to see student submissions and manage results.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;