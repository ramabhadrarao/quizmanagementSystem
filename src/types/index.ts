export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'code';
  title: string;
  content: string;
  options?: string[];
  correctAnswer?: string | number;
  language?: 'javascript' | 'python' | 'cpp' | 'c' | 'java';
  testCases?: TestCase[];
  starterCode?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  isPublished: boolean;
  createdBy: string;
  allowedAttempts: number;
  showResults: boolean;
  randomizeQuestions: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  questionId: string;
  type: 'multiple-choice' | 'code';
  answer: string | number;
  code?: string;
  isCorrect?: boolean;
  score?: number;
  executionResult?: {
    output?: string;
    error?: string;
    testResults?: {
      passed: boolean;
      input: string;
      expectedOutput: string;
      actualOutput: string;
    }[];
  };
}

export interface Submission {
  id: string;
  quiz: Quiz;
  user: User;
  answers: Answer[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent?: number;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}