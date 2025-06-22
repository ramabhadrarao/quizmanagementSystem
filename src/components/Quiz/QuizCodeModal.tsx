import React, { useState } from 'react';
import { X, Key, AlertCircle } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import api from '../../services/api';
import { toast } from '../UI/Toaster';

interface QuizCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (quizId: string) => void;
}

const QuizCodeModal: React.FC<QuizCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [quizCode, setQuizCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!quizCode.trim()) {
      setError('Please enter a quiz code');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/quizzes/verify-code', {
        quizCode: quizCode.trim().toUpperCase(),
      });
      
      toast.success('Quiz code verified successfully!');
      onSuccess(response.data.quiz.id);
      setQuizCode('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid quiz code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Enter Quiz Code</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Quiz Code"
                value={quizCode}
                onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="text-center text-2xl font-mono tracking-wider"
                error={error}
              />
              <p className="text-sm text-gray-600 mt-2">
                Enter the unique quiz code provided by your instructor
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !quizCode.trim()}
                className="flex-1"
              >
                {loading ? 'Verifying...' : 'Start Quiz'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizCodeModal;