// src/components/Quiz/QuizSubmissionModal.tsx - Fixed to handle selected questions
import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, Code, FileText } from 'lucide-react';
import Button from '../UI/Button';

interface QuizSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  quiz: any;
  answers: any[];
  timeSpent: number;
  isSubmitting: boolean;
}

const QuizSubmissionModal: React.FC<QuizSubmissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  quiz,
  answers,
  timeSpent,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  // Count answered questions based on actual answers array
  const answeredQuestions = answers.filter(a => {
    if (a.type === 'multiple-choice') {
      return a.answer !== -1 && a.answer !== '';
    } else {
      return a.code && a.code.trim().length > 0;
    }
  }).length;

  // Use the actual number of questions shown to the user
  const totalQuestions = quiz?.questions?.length || 0;
  const unansweredCount = totalQuestions - answeredQuestions;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get pool info if applicable
  const getPoolInfo = () => {
    if (!quiz.questionPoolConfig?.enabled) {
      return null;
    }

    const originalTotal = quiz.originalQuestionCount || quiz.totalQuestions;
    if (originalTotal && originalTotal > totalQuestions) {
      return `${totalQuestions} questions selected from a pool of ${originalTotal}`;
    }
    return null;
  };

  const poolInfo = getPoolInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Submit Quiz Confirmation
            </h2>
            <p className="text-gray-600">
              Please review your answers before final submission
            </p>
          </div>

          {/* Quiz Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quiz Summary</h3>
            
            {poolInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  📊 {poolInfo}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Answered</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {answeredQuestions}/{totalQuestions}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Time Spent</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(timeSpent)}
                </div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Warning: {unansweredCount} question{unansweredCount > 1 ? 's' : ''} not answered
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Unanswered questions will receive 0 points.
                </p>
              </div>
            )}
          </div>

          {/* Question Status */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Question Status</h3>
            <div className="grid grid-cols-5 gap-2">
              {quiz?.questions?.map((question: any, index: number) => {
                const questionId = question._id || question.id || `question_${index}`;
                const answer = answers.find(a => a.questionId === questionId);
                const isAnswered = answer && (
                  answer.type === 'multiple-choice' 
                    ? answer.answer !== -1 && answer.answer !== ''
                    : answer.code && answer.code.trim().length > 0
                );

                return (
                  <div
                    key={questionId}
                    className={`p-2 rounded-lg text-center text-sm font-medium ${
                      isAnswered
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {question.type === 'code' ? (
                        <Code className="w-3 h-3" />
                      ) : (
                        <FileText className="w-3 h-3" />
                      )}
                    </div>
                    <div>Q{index + 1}</div>
                    <div className="text-xs">
                      {isAnswered ? 'Done' : 'Empty'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning Messages */}
          <div className="space-y-3 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">ℹ️</div>
                <div>
                  <p className="font-medium text-blue-900">Important Information</p>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1">
                    <li>• Once submitted, you cannot modify your answers</li>
                    <li>• Code questions will be automatically graded</li>
                    <li>• Results will be available after processing completes</li>
                    <li>• You cannot retake this quiz after submission</li>
                    {quiz.questionPoolConfig?.enabled && (
                      <li>• Each student receives a unique set of questions from the pool</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Incomplete Submission</p>
                    <p className="text-sm text-red-800 mt-1">
                      You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. 
                      Are you sure you want to submit?
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Review Answers
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Confirm Submission'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSubmissionModal;