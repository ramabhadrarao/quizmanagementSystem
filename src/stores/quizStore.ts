import { create } from 'zustand';
import api from '../services/api';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'code';
  title: string;
  content: string;
  options?: string[];
  correctAnswer?: string | number;
  language?: string;
  testCases?: TestCase[];
  points: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
  fetchQuizzes: () => Promise<void>;
  fetchQuiz: (id: string) => Promise<void>;
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,

  fetchQuizzes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/quizzes');
      // Handle both array response and object with quizzes property
      const quizData = response.data.quizzes || response.data;
      // Ensure quizzes is always an array
      const quizzes = Array.isArray(quizData) ? quizData : [];
      set({ quizzes, loading: false });
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      set({ error: 'Failed to fetch quizzes', loading: false, quizzes: [] });
    }
  },

  fetchQuiz: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/quizzes/${id}`);
      set({ currentQuiz: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      set({ error: 'Failed to fetch quiz', loading: false });
    }
  },

  createQuiz: async (quiz) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/quizzes', quiz);
      const newQuiz = response.data;
      set((state) => ({
        quizzes: [...state.quizzes, newQuiz],
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to create quiz:', error);
      set({ error: 'Failed to create quiz', loading: false });
      throw error;
    }
  },

  updateQuiz: async (id: string, quizUpdate) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/quizzes/${id}`, quizUpdate);
      const updatedQuiz = response.data;
      set((state) => ({
        quizzes: state.quizzes.map((q) => (q.id === id ? updatedQuiz : q)),
        currentQuiz: state.currentQuiz?.id === id ? updatedQuiz : state.currentQuiz,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to update quiz:', error);
      set({ error: 'Failed to update quiz', loading: false });
      throw error;
    }
  },

  deleteQuiz: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/quizzes/${id}`);
      set((state) => ({
        quizzes: state.quizzes.filter((q) => q.id !== id),
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      set({ error: 'Failed to delete quiz', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));