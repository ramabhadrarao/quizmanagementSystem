import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, Plus, Trash2, ArrowLeft, Code, FileText } from 'lucide-react';
import { useQuizStore, Question } from '../../stores/quizStore';
import Button from '../UI/Button';
import Input from '../UI/Input';
import RichTextEditor from './RichTextEditor';
import CodeEditor from './CodeEditor';
import { toast } from '../UI/Toaster';

const QuizEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentQuiz, fetchQuiz, createQuiz, updateQuiz, loading } = useQuizStore();
  
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    timeLimit: 60,
    isPublished: false,
    questions: [] as Question[],
  });

  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuiz(id);
    }
  }, [id, fetchQuiz]);

  useEffect(() => {
    if (currentQuiz) {
      setQuiz({
        title: currentQuiz.title,
        description: currentQuiz.description,
        timeLimit: currentQuiz.timeLimit,
        isPublished: currentQuiz.isPublished,
        questions: currentQuiz.questions,
      });
    }
  }, [currentQuiz]);

  const validateQuiz = () => {
    if (!quiz.title.trim()) {
      toast.error('Quiz title is required');
      return false;
    }

    if (!quiz.description.trim()) {
      toast.error('Quiz description is required');
      return false;
    }

    if (quiz.questions.length === 0) {
      toast.error('At least one question is required');
      return false;
    }

    // Validate each question
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      
      if (!question.title.trim()) {
        toast.error(`Question ${i + 1}: Title is required`);
        return false;
      }

      if (!question.content.trim()) {
        toast.error(`Question ${i + 1}: Content is required`);
        return false;
      }

      if (question.type === 'multiple-choice') {
        if (!question.options || question.options.length < 2) {
          toast.error(`Question ${i + 1}: At least 2 options are required`);
          return false;
        }

        const nonEmptyOptions = question.options.filter(opt => opt.trim());
        if (nonEmptyOptions.length < 2) {
          toast.error(`Question ${i + 1}: Options cannot be empty`);
          return false;
        }

        if (question.correctAnswer === undefined || question.correctAnswer === null || question.correctAnswer < 0) {
          toast.error(`Question ${i + 1}: Please select the correct answer`);
          return false;
        }
      } else if (question.type === 'code') {
        if (!question.language) {
          toast.error(`Question ${i + 1}: Programming language is required`);
          return false;
        }

        if (!question.testCases || question.testCases.length === 0) {
          toast.error(`Question ${i + 1}: At least one test case is required`);
          return false;
        }

        for (let j = 0; j < question.testCases.length; j++) {
          const testCase = question.testCases[j];
          if (testCase.expectedOutput.trim() === '') {
            toast.error(`Question ${i + 1}, Test Case ${j + 1}: Expected output is required`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSave = async (publish = false) => {
    if (!validateQuiz()) {
      return;
    }

    try {
      // Prepare quiz data with proper format
      const quizData = {
        title: quiz.title.trim(),
        description: quiz.description.trim(),
        timeLimit: quiz.timeLimit,
        isPublished: publish,
        questions: quiz.questions.map(q => ({
          type: q.type,
          title: q.title.trim(),
          content: q.content.trim(),
          points: q.points || 1,
          ...(q.type === 'multiple-choice' 
            ? { 
                options: q.options?.map(opt => opt.trim()) || [],
                correctAnswer: Number(q.correctAnswer)
              }
            : { 
                language: q.language,
                testCases: q.testCases?.map(tc => ({
                  input: tc.input || '',
                  expectedOutput: tc.expectedOutput.trim(),
                  isHidden: tc.isHidden || false
                })) || []
              }
          ),
        })),
      };
      
      if (id) {
        await updateQuiz(id, quizData);
        toast.success(publish ? 'Quiz published successfully' : 'Quiz saved successfully');
      } else {
        await createQuiz(quizData);
        toast.success('Quiz created successfully');
        navigate('/quizzes');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      const errorMessage = error.response?.data?.details || error.response?.data?.message || 'Failed to save quiz';
      toast.error(errorMessage);
    }
  };

  const addQuestion = (type: 'multiple-choice' | 'code') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: '',
      content: '',
      points: 1,
      ...(type === 'multiple-choice' 
        ? { options: ['', '', '', ''], correctAnswer: 0 }
        : { language: 'javascript', testCases: [{ input: '', expectedOutput: '', isHidden: false }] }
      ),
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    
    setActiveQuestion(quiz.questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuiz(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
      
      if (activeQuestion === index) {
        setActiveQuestion(null);
      } else if (activeQuestion !== null && activeQuestion > index) {
        setActiveQuestion(activeQuestion - 1);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/quizzes')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
          <p className="text-gray-600">
            Build engaging quizzes with rich content and code challenges
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            <Eye className="w-4 h-4 mr-2" />
            {quiz.isPublished ? 'Update & Publish' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quiz Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quiz Settings</h2>
            
            <div className="space-y-4">
              <Input
                label="Quiz Title"
                value={quiz.title}
                onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={quiz.description}
                  onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the quiz"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={3}
                />
              </div>
              
              <Input
                label="Time Limit (minutes)"
                type="number"
                value={quiz.timeLimit}
                onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 60 }))}
                min="1"
                max="300"
              />

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Add Questions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => addQuestion('multiple-choice')}
                    className="w-full justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Multiple Choice
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => addQuestion('code')}
                    className="w-full justify-start"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Code Challenge
                  </Button>
                </div>
              </div>

              {quiz.questions.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Questions ({quiz.questions.length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {quiz.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          activeQuestion === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveQuestion(index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {question.type === 'code' ? (
                                <Code className="w-4 h-4 text-blue-600" />
                              ) : (
                                <FileText className="w-4 h-4 text-green-600" />
                              )}
                              <span className="text-sm font-medium">
                                Question {index + 1}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {question.title || 'Untitled Question'}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQuestion(index);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Editor */}
        <div className="lg:col-span-2">
          {activeQuestion !== null && quiz.questions[activeQuestion] ? (
            <QuestionEditor
              question={quiz.questions[activeQuestion]}
              questionIndex={activeQuestion}
              onUpdate={(updates) => updateQuestion(activeQuestion, updates)}
            />
          ) : (
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Question Selected
              </h3>
              <p className="text-gray-600 mb-6">
                Add a new question or select an existing one to start editing
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => addQuestion('multiple-choice')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Add Multiple Choice
                </Button>
                <Button variant="outline" onClick={() => addQuestion('code')}>
                  <Code className="w-4 h-4 mr-2" />
                  Add Code Challenge
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  onUpdate: (updates: Partial<Question>) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  questionIndex,
  onUpdate,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        {question.type === 'code' ? (
          <Code className="w-6 h-6 text-blue-600" />
        ) : (
          <FileText className="w-6 h-6 text-green-600" />
        )}
        <h2 className="text-xl font-semibold text-gray-900">
          Question {questionIndex + 1} - {question.type === 'code' ? 'Code Challenge' : 'Multiple Choice'}
        </h2>
      </div>

      <div className="space-y-6">
        <Input
          label="Question Title"
          value={question.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter question title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Content
          </label>
          <RichTextEditor
            value={question.content}
            onChange={(content) => onUpdate({ content })}
            placeholder="Enter your question content. You can use LaTeX for math expressions and add images."
          />
        </div>

        {question.type === 'multiple-choice' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Answer Options
            </label>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === index}
                    onChange={() => onUpdate({ correctAnswer: index })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[index] = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programming Language
              </label>
              <select
                value={question.language}
                onChange={(e) => onUpdate({ language: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Cases
              </label>
              <div className="space-y-3">
                {question.testCases?.map((testCase, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Test Case {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newTestCases = question.testCases?.filter((_, i) => i !== index) || [];
                          onUpdate({ testCases: newTestCases });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Input
                        </label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) => {
                            const newTestCases = [...(question.testCases || [])];
                            newTestCases[index] = { ...testCase, input: e.target.value };
                            onUpdate({ testCases: newTestCases });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          rows={2}
                          placeholder="Input for this test case"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Expected Output
                        </label>
                        <textarea
                          value={testCase.expectedOutput}
                          onChange={(e) => {
                            const newTestCases = [...(question.testCases || [])];
                            newTestCases[index] = { ...testCase, expectedOutput: e.target.value };
                            onUpdate({ testCases: newTestCases });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          rows={2}
                          placeholder="Expected output"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newTestCases = [...(question.testCases || []), { input: '', expectedOutput: '', isHidden: false }];
                    onUpdate({ testCases: newTestCases });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Test Case
                </Button>
              </div>
            </div>
          </div>
        )}

        <Input
          label="Points"
          type="number"
          value={question.points}
          onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 1 })}
          min="1"
          max="100"
        />
      </div>
    </div>
  );
};

export default QuizEditor;