// src/components/Quiz/QuizTaking.tsx - Complete updated version with submission check
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, Code, FileText, ArrowLeft, ArrowRight, Save, Wifi, WifiOff } from 'lucide-react';
import { useQuizStore, Question } from '../../stores/quizStore';
import Button from '../UI/Button';
import CodeEditor from './CodeEditor';
import QuizSubmissionModal from './QuizSubmissionModal';
import { toast } from '../UI/Toaster';
import api from '../../services/api';

interface Answer {
  questionId: string;
  type: 'multiple-choice' | 'code';
  answer: string | number;
  code?: string;
}

interface SubmissionStatus {
  hasSubmission: boolean;
  submission?: {
    id: string;
    status: 'in_progress' | 'submitted' | 'processing' | 'completed';
    startedAt: string;
    completedAt?: string;
    timeSpent: number;
    percentage?: number;
    canResume: boolean;
    answers?: Answer[];
  };
}

const QuizTaking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, fetchQuiz, loading } = useQuizStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState<React.ReactNode>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isResuming, setIsResuming] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Refs for intervals and timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const timeStartRef = useRef<number>(Date.now());

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for existing submission on load
  useEffect(() => {
    if (id) {
      console.log('🔍 Checking for existing submission...');
      setCheckingStatus(true);
      
      const checkSubmissionStatus = async () => {
        try {
          // First check if user has already taken this quiz
          const statusResponse = await api.get(`/submissions/status/${id}`);
          const status: SubmissionStatus = statusResponse.data;
          
          if (status.hasSubmission && status.submission) {
            const submission = status.submission;
            
            // If quiz is completed, redirect to results
            if (submission.status === 'completed') {
              console.log('🔍 User has already completed this quiz, redirecting to results...');
              toast.info('You have already completed this quiz. Showing your results.');
              navigate(`/quiz/result/${submission.id}`, { replace: true });
              return;
            }
            
            // If quiz is being processed, also redirect to results
            if (submission.status === 'processing' || submission.status === 'submitted') {
              console.log('🔍 Quiz is being processed, redirecting to results...');
              toast.info('Your quiz is being processed. Redirecting to results.');
              navigate(`/quiz/result/${submission.id}`, { replace: true });
              return;
            }
            
            // If quiz is in progress, offer to resume
            if (submission.status === 'in_progress' && submission.canResume) {
              console.log('🔍 Found in-progress submission, offering to resume...');
              
              const shouldResume = window.confirm(
                'You have an in-progress quiz attempt. Would you like to resume where you left off?'
              );
              
              if (shouldResume) {
                setIsResuming(true);
                setSubmissionId(submission.id);
                setTotalTimeSpent(submission.timeSpent || 0);
                
                // Fetch quiz data
                await fetchQuiz(id);
                
                // Start the quiz in resume mode
                setQuizStarted(true);
                setAnswers(submission.answers || []);
                timeStartRef.current = Date.now();
              } else {
                // User chose not to resume, go back to quiz list
                navigate('/quizzes');
                return;
              }
            }
          } else {
            // No existing submission, fetch quiz data normally
            await fetchQuiz(id);
          }
        } catch (error) {
          console.error('🔍 Error checking submission status:', error);
          // If error checking status, still try to load the quiz
          await fetchQuiz(id);
        } finally {
          setCheckingStatus(false);
        }
      };
      
      checkSubmissionStatus().catch(err => {
        console.error('🔍 Error in submission status check:', err);
        setError('Failed to load quiz. Please try again.');
        setCheckingStatus(false);
      });
    }
  }, [id, fetchQuiz, navigate]);

  // Auto-save function
  const autoSave = useCallback(async (questionId: string, answer: string | number, code?: string) => {
    if (!submissionId || !isOnline) return;

    try {
      setIsAutoSaving(true);
      const currentTimeSpent = totalTimeSpent + Math.floor((Date.now() - timeStartRef.current) / 1000);
      
      await api.post('/submissions/save-answer', {
        submissionId,
        questionId,
        answer,
        code,
        timeSpent: currentTimeSpent,
      });
      
      setLastSaveTime(new Date());
      console.log('🔍 Auto-saved answer for question:', questionId);
    } catch (error) {
      console.error('🔍 Auto-save failed:', error);
      toast.error('Failed to auto-save. Please check your connection.');
    } finally {
      setIsAutoSaving(false);
    }
  }, [submissionId, isOnline, totalTimeSpent]);

  // Debounced auto-save
  const debouncedAutoSave = useCallback((questionId: string, answer: string | number, code?: string) => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }
    
    autoSaveRef.current = setTimeout(() => {
      autoSave(questionId, answer, code);
    }, 2000);
  }, [autoSave]);

  // Timer management
  useEffect(() => {
    if (currentQuiz && quizStarted && !isResuming) {
      setTimeLeft(currentQuiz.timeLimit * 60);
      timeStartRef.current = Date.now();
    } else if (currentQuiz && quizStarted && isResuming) {
      const timeAllowed = currentQuiz.timeLimit * 60;
      const timeSpentAlready = totalTimeSpent;
      const remainingTime = Math.max(0, timeAllowed - timeSpentAlready);
      setTimeLeft(remainingTime);
      timeStartRef.current = Date.now();
    }
  }, [currentQuiz, quizStarted, isResuming, totalTimeSpent]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && quizStarted) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            console.log('🔍 Time expired, auto-submitting...');
            handleTimeExpiredSubmit();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [timeLeft, quizStarted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, []);

  // Beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (quizStarted && !isSubmitting) {
        e.preventDefault();
        e.returnValue = 'You have an active quiz. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [quizStarted, isSubmitting]);

  const startQuiz = async () => {
    if (!currentQuiz) {
      toast.error('Quiz data not loaded');
      return;
    }

    try {
      console.log('🔍 Starting new quiz attempt...');
      
      const response = await api.post('/submissions/start', {
        quizId: currentQuiz.id || currentQuiz._id,
      });
      
      const { submission } = response.data;
      
      setSubmissionId(submission.id);
      setQuizStarted(true);
      setTotalTimeSpent(submission.timeSpent || 0);
      
      if (submission.isResuming) {
        setIsResuming(true);
        setAnswers(submission.answers);
        toast.success('Resumed quiz attempt');
      } else {
        setAnswers(submission.answers);
        toast.success('Quiz started');
      }
      
      timeStartRef.current = Date.now();
      
    } catch (error: any) {
      console.error('🔍 Error starting quiz:', error);
      
      if (error.response?.data?.hasSubmission) {
        // User has already taken this quiz
        const submissionId = error.response.data.submissionId;
        
        if (submissionId) {
          toast.error('You have already taken this quiz. Redirecting to your results...');
          setTimeout(() => {
            navigate(`/quiz/result/${submissionId}`, { replace: true });
          }, 2000);
        } else {
          setError(
            <div>
              <p className="mb-4">{error.response.data.message}</p>
              <p className="text-sm">
                If you believe this is an error, please contact your instructor or administrator.
              </p>
            </div>
          );
        }
      } else {
        toast.error(error.response?.data?.message || 'Failed to start quiz');
        setError(error.response?.data?.message || 'Failed to start quiz');
      }
    }
  };

  const updateAnswer = (questionId: string, answer: string | number, code?: string) => {
    console.log('🔍 Updating answer:', { questionId, answer: typeof answer === 'string' ? answer.substring(0, 50) + '...' : answer });
    
    setAnswers(prev => {
      const updated = prev.map(a => 
        a.questionId === questionId 
          ? { ...a, answer, code }
          : a
      );
      return updated;
    });
    
    debouncedAutoSave(questionId, answer, code);
  };

  const handleSubmitClick = () => {
    setShowSubmissionModal(true);
  };

  const handleTimeExpiredSubmit = async () => {
    if (!submissionId) return;
    
    console.log('🔍 Time expired, force submitting...');
    await performSubmission(true);
  };

  const handleConfirmSubmission = async () => {
    setShowSubmissionModal(false);
    await performSubmission(false);
  };

  const performSubmission = async (forceSubmit = false) => {
    if (!submissionId) {
      toast.error('No active submission found');
      return;
    }

    console.log('🔍 Submitting quiz...', { submissionId, forceSubmit });

    setIsSubmitting(true);
    try {
      const currentTimeSpent = totalTimeSpent + Math.floor((Date.now() - timeStartRef.current) / 1000);
      
      const response = await api.post('/submissions/submit', {
        submissionId,
        timeSpent: currentTimeSpent,
        forceSubmit,
      });
      
      console.log('🔍 Quiz submitted successfully:', response.data);
      
      if (forceSubmit) {
        toast.success('Quiz auto-submitted due to time limit!');
      } else {
        toast.success('Quiz submitted successfully!');
      }
      
      // Clear timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
      
      // Navigate to result page
      const submission = response.data.submission;
      if (submission && submission.id) {
        navigate(`/quiz/result/${submission.id}`, { 
          replace: true,
          state: { 
            processing: true, 
            message: 'Your quiz is being graded. Results will be available shortly.' 
          }
        });
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('🔍 Submission error:', error);
      
      let errorMessage = 'Failed to submit quiz';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isAnswered = (questionId: string) => {
    const answer = answers.find(a => a.questionId === questionId);
    if (!answer) return false;
    
    if (answer.type === 'multiple-choice') {
      return answer.answer !== -1 && answer.answer !== '';
    } else {
      return answer.code && answer.code.trim().length > 0;
    }
  };

  // Loading state
  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {checkingStatus ? 'Checking quiz status...' : 'Loading quiz...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Access Quiz
          </h2>
          <div className="text-gray-600 mb-6">
            {error || 'The quiz you are looking for does not exist or has been removed.'}
          </div>
          <Button onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            {error ? (
              // Show error state
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Unable to Start Quiz
                </h2>
                
                <div className="text-gray-600 mb-8">
                  {error}
                </div>
                
                <Button onClick={() => navigate('/quizzes')}>
                  Back to Quizzes
                </Button>
              </>
            ) : (
              // Show quiz start screen
              <>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentQuiz.title}
                </h1>
                
                <p className="text-gray-600 mb-8">
                  {currentQuiz.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900 mb-1">
                      {currentQuiz.questions?.length || 0}
                    </div>
                    <div className="text-sm text-blue-700">Questions</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900 mb-1">
                      {currentQuiz.timeLimit}
                    </div>
                    <div className="text-sm text-purple-700">Minutes</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900 mb-1">
                      {currentQuiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0}
                    </div>
                    <div className="text-sm text-green-700">Points</div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                  <AlertCircle className="w-5 h-5 text-yellow-600 inline mr-2" />
                  <span className="text-sm text-yellow-800">
                    Your progress will be automatically saved. You can only take this quiz once.
                  </span>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/quizzes')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Quizzes
                  </Button>
                  <Button
                    onClick={startQuiz}
                    size="lg"
                  >
                    {isResuming ? 'Resume Quiz' : 'Start Quiz'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Validate current question
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Question</h2>
          <Button onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const questionId = currentQuestion._id || currentQuestion.id || `question_${currentQuestionIndex}`;
  const currentAnswer = answers.find(a => a.questionId === questionId);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {currentQuiz.title}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              {/* Auto-save Status */}
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Save className="w-4 h-4 animate-pulse" />
                  Saving...
                </div>
              )}
              
              {lastSaveTime && !isAutoSaving && (
                <div className="text-sm text-gray-500">
                  Last saved: {lastSaveTime.toLocaleTimeString()}
                </div>
              )}
              
              {/* Timer */}
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`} />
                <span className={timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              <Button
                onClick={handleSubmitClick}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>
                {answers.filter(a => isAnswered(a.questionId)).length} of {currentQuiz.questions.length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                {currentQuiz.questions.map((question, index) => {
                  const qId = question._id || question.id || `question_${index}`;
                  return (
                    <button
                      key={qId}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-blue-600 text-white'
                          : isAnswered(qId)
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {question.type === 'code' ? (
                          <Code className="w-3 h-3" />
                        ) : (
                          <FileText className="w-3 h-3" />
                        )}
                        <span className="hidden lg:inline">Q{index + 1}</span>
                        <span className="lg:hidden">{index + 1}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                {currentQuestion.type === 'code' ? (
                  <Code className="w-6 h-6 text-blue-600" />
                ) : (
                  <FileText className="w-6 h-6 text-green-600" />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentQuestion.title}
                  </h2>
                  <span className="text-sm text-gray-600">
                    {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.content }}
                />
              </div>

              {currentQuestion.type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        currentAnswer?.answer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionId}`}
                        value={index}
                        checked={currentAnswer?.answer === index}
                        onChange={() => updateAnswer(questionId, index)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                      {currentQuestion.language?.toUpperCase()}
                    </span>
                  </div>
                  <CodeEditor
                    value={currentAnswer?.code || ''}
                    onChange={(code) => updateAnswer(questionId, code, code)}
                    language={currentQuestion.language || 'javascript'}
                    height="400px"
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="text-sm text-gray-600">
                  {isAnswered(questionId) ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Answered & Saved
                    </span>
                  ) : (
                    <span className="text-gray-500">Not answered</span>
                  )}
                </div>

                <Button
                  onClick={() => setCurrentQuestionIndex(Math.min(currentQuiz.questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === currentQuiz.questions.length - 1}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <QuizSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        onConfirm={handleConfirmSubmission}
        quiz={currentQuiz}
        answers={answers}
        timeSpent={totalTimeSpent + Math.floor((Date.now() - timeStartRef.current) / 1000)}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default QuizTaking;