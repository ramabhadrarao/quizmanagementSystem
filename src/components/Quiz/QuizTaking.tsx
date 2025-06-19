import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, Code, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useQuizStore, Question } from '../../stores/quizStore';
import Button from '../UI/Button';
import CodeEditor from './CodeEditor';
import { toast } from '../UI/Toaster';
import api from '../../services/api';

interface Answer {
  questionId: string;
  type: 'multiple-choice' | 'code';
  answer: string | number;
  code?: string;
}

const QuizTaking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, fetchQuiz, loading } = useQuizStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      console.log('Fetching quiz with ID:', id);
      fetchQuiz(id).catch(err => {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again.');
      });
    }
  }, [id, fetchQuiz]);

  useEffect(() => {
    if (currentQuiz && quizStarted) {
      setTimeLeft(currentQuiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [currentQuiz, quizStarted]);

  useEffect(() => {
    if (timeLeft > 0 && quizStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmit();
    }
  }, [timeLeft, quizStarted]);

  const startQuiz = () => {
    if (!currentQuiz) {
      toast.error('Quiz data not loaded');
      return;
    }

    setQuizStarted(true);
    // Initialize answers with proper question IDs
    const initialAnswers: Answer[] = currentQuiz.questions.map((question, index) => ({
      questionId: question._id || question.id || index.toString(),
      type: question.type,
      answer: question.type === 'multiple-choice' ? -1 : '',
      code: question.type === 'code' ? '' : undefined,
    }));
    setAnswers(initialAnswers);
    console.log('Quiz started with answers:', initialAnswers);
  };

  const updateAnswer = (questionId: string, answer: string | number, code?: string) => {
    console.log('Updating answer:', { questionId, answer, code });
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, answer, code }
          : a
      )
    );
  };

  const handleSubmit = async () => {
    if (!currentQuiz) return;

    setIsSubmitting(true);
    try {
      const submission = {
        quizId: currentQuiz._id || currentQuiz.id,
        answers: answers.map(a => ({
          ...a,
          answer: a.type === 'code' ? (a.code || '') : a.answer
        })),
        completedAt: new Date().toISOString(),
      };

      console.log('Submitting quiz:', submission);
      await api.post('/submissions', submission);
      toast.success('Quiz submitted successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
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
      return answer.answer !== -1;
    } else {
      return answer.code && answer.code.trim().length > 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Quiz Not Found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'The quiz you are looking for does not exist or has been removed.'}
          </p>
          <Button onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 text-center">
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
                Once you start, you cannot pause the quiz. Make sure you have a stable internet connection.
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
                Start Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === (currentQuestion._id || currentQuestion.id || currentQuestionIndex.toString()));

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

  return (
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
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`} />
              <span className={timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <Button
              onClick={handleSubmit}
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
                const qId = question._id || question.id || index.toString();
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
                      name={`question-${currentQuestion._id || currentQuestion.id}`}
                      value={index}
                      checked={currentAnswer?.answer === index}
                      onChange={() => updateAnswer(
                        currentQuestion._id || currentQuestion.id || currentQuestionIndex.toString(), 
                        index
                      )}
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
                  onChange={(code) => updateAnswer(
                    currentQuestion._id || currentQuestion.id || currentQuestionIndex.toString(), 
                    code, 
                    code
                  )}
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
                {isAnswered(currentQuestion._id || currentQuestion.id || currentQuestionIndex.toString()) ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Answered
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
  );
};

export default QuizTaking;