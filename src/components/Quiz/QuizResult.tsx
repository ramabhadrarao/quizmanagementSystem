// src/components/Quiz/QuizResult.tsx - Updated with proper processing state handling
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Code, 
  FileText, 
  ArrowLeft, 
  RefreshCw,
  Award,
  TrendingUp,
  Eye,
  EyeOff,
  Loader
} from 'lucide-react';
import Button from '../UI/Button';
import api from '../../services/api';

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

interface ExecutionResult {
  output?: string;
  error?: string;
  testResults?: TestResult[];
}

interface AnswerResult {
  questionId: string;
  type: 'multiple-choice' | 'code';
  answer: string | number;
  code?: string;
  isCorrect: boolean;
  score: number;
  executionResult?: ExecutionResult;
}

interface QuizResultData {
  id: string;
  quiz: {
    id: string;
    title: string;
    description: string;
    questions: any[];
  };
  answers: AnswerResult[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
  status: 'completed' | 'processing' | 'submitted' | 'error';
}

const QuizResult: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<QuizResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [pollCount, setPollCount] = useState(0);
  const maxPollAttempts = 60; // 5 minutes with 5-second intervals

  useEffect(() => {
    if (id) {
      fetchResult();
    }
  }, [id]);

  useEffect(() => {
    // Set up polling for processing status
    let pollInterval: NodeJS.Timeout | null = null;

    if (result && (result.status === 'processing' || result.status === 'submitted')) {
      pollInterval = setInterval(() => {
        if (pollCount < maxPollAttempts) {
          fetchResult(true); // Silent fetch during polling
          setPollCount(prev => prev + 1);
        } else {
          // Stop polling after max attempts
          if (pollInterval) clearInterval(pollInterval);
          setError('Processing is taking longer than expected. Please refresh the page.');
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [result?.status, pollCount]);

  const fetchResult = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const response = await api.get(`/submissions/${id}`);
      const data = response.data;
      
      setResult(data);
      
      // Reset poll count if status changed to completed
      if (data.status === 'completed') {
        setPollCount(0);
      }
      
      setError(null);
    } catch (err: any) {
      if (!silent) {
        setError(err.response?.data?.message || 'Failed to load quiz result');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'F';
  };

  const getProcessingMessage = () => {
    const messages = [
      'Evaluating your answers...',
      'Running test cases...',
      'Calculating your score...',
      'Almost there...',
      'Processing code submissions...',
      'Finalizing results...'
    ];
    const index = Math.min(Math.floor(pollCount / 3), messages.length - 1);
    return messages[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz result...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Result Not Found'}
          </h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show processing state
  if (result.status === 'processing' || result.status === 'submitted') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-200 rounded-full mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <Loader className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Your Results
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">{getProcessingMessage()}</p>
            <p className="text-sm text-gray-500">
              This may take a few moments, especially for code questions.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min((pollCount / 12) * 100, 90)}%`
              }}
            />
          </div>

          <div className="space-y-3">
            <Button onClick={() => fetchResult()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Status
            </Button>
            
            {pollCount > 20 && (
              <p className="text-sm text-yellow-600">
                ⚠️ Processing is taking longer than usual. Your code might be complex or the server might be busy.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (result.status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Error
          </h2>
          
          <p className="text-gray-600 mb-6">
            There was an error processing your quiz submission. This might be due to a temporary issue with our servers.
          </p>
          
          <div className="space-y-3">
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <p className="text-sm text-gray-500">
              Please contact your instructor if this issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show completed results
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Quiz Results
          </h1>
          <p className="text-gray-600">
            {result.quiz.title}
          </p>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
            result.percentage >= 70 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.percentage >= 70 ? (
              <Award className={`w-12 h-12 ${getGradeColor(result.percentage)}`} />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          
          <h2 className="text-4xl font-bold mb-2">
            <span className={getGradeColor(result.percentage)}>
              {result.percentage}%
            </span>
          </h2>
          
          <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold mb-4 ${
            result.percentage >= 90 ? 'bg-green-100 text-green-800' :
            result.percentage >= 80 ? 'bg-blue-100 text-blue-800' :
            result.percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
            result.percentage >= 60 ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            Grade: {getGradeBadge(result.percentage)}
          </div>

          <p className="text-gray-600">
            {result.percentage >= 90 ? 'Excellent work!' :
             result.percentage >= 80 ? 'Great job!' :
             result.percentage >= 70 ? 'Good effort!' :
             result.percentage >= 60 ? 'You can do better!' :
             'Keep practicing!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {result.totalScore}/{result.maxScore}
            </div>
            <div className="text-sm text-gray-600">Points Scored</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatTime(result.timeSpent || 0)}
            </div>
            <div className="text-sm text-gray-600">Time Taken</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {result.answers.filter(a => a.isCorrect).length}
            </div>
            <div className="text-sm text-gray-600">Correct Answers</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {result.quiz.questions.length}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Answer Review</h3>
          <Button
            variant="outline"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Answers
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Answers
              </>
            )}
          </Button>
        </div>

        {showAnswers && (
          <div className="space-y-6">
            {result.quiz.questions.map((question: any, index: number) => {
              const questionId = question._id || question.id || `question_${index}`;
              const answer = result.answers.find(a => a.questionId === questionId);
              const isExpanded = expandedQuestions.has(questionId);

              return (
                <div
                  key={questionId}
                  className={`border rounded-lg p-6 ${
                    answer?.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {question.type === 'code' ? (
                        <Code className="w-5 h-5 text-blue-600 mt-1" />
                      ) : (
                        <FileText className="w-5 h-5 text-green-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Question {index + 1}: {question.title}
                        </h4>
                        <div
                          className="prose prose-sm max-w-none mb-3"
                          dangerouslySetInnerHTML={{ __html: question.content }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        answer?.isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {answer?.isCorrect ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {answer?.score || 0}/{question.points} pts
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQuestionExpansion(questionId)}
                      >
                        {isExpanded ? 'Hide Details' : 'Show Details'}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t pt-4 mt-4">
                      {question.type === 'multiple-choice' ? (
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Your Answer:</h5>
                            <div className={`p-3 rounded border ${
                              answer?.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                            }`}>
                              {question.options?.[answer?.answer as number] || 'No answer selected'}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Correct Answer:</h5>
                            <div className="p-3 rounded border border-green-200 bg-green-50">
                              {question.options?.[question.correctAnswer] || 'Not available'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Your Code:</h5>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                              {answer?.code || 'No code submitted'}
                            </pre>
                          </div>
                          
                          {answer?.executionResult && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Execution Results:</h5>
                              
                              {answer.executionResult.error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                  <h6 className="font-medium text-red-900 mb-1">Error:</h6>
                                  <pre className="text-red-800 text-sm">{answer.executionResult.error}</pre>
                                </div>
                              )}
                              
                              {answer.executionResult.testResults && (
                                <div className="space-y-2">
                                  {answer.executionResult.testResults.map((test: TestResult, testIndex: number) => (
                                    <div
                                      key={testIndex}
                                      className={`border rounded-lg p-3 ${
                                        test.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">Test Case {testIndex + 1}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                          test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {test.passed ? 'PASSED' : 'FAILED'}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-3 gap-3 text-sm">
                                        <div>
                                          <div className="font-medium text-gray-700">Input:</div>
                                          <div className="bg-gray-100 p-2 rounded font-mono">
                                            {test.input || '(empty)'}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-medium text-gray-700">Expected:</div>
                                          <div className="bg-gray-100 p-2 rounded font-mono">
                                            {test.expectedOutput}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="font-medium text-gray-700">Your Output:</div>
                                          <div className={`p-2 rounded font-mono ${
                                            test.passed ? 'bg-green-100' : 'bg-red-100'
                                          }`}>
                                            {test.actualOutput || '(no output)'}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResult;