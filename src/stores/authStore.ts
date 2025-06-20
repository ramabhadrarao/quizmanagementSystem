// src/stores/authStore.ts - Enhanced with token cleanup
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
  clearAuthErrors: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data;
          
          // Set authorization header for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error: any) {
          // Clear any existing auth data on login failure
          get().logout();
          throw error;
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          const { user, token } = response.data;
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error: any) {
          // Clear any existing auth data on register failure
          get().logout();
          throw error;
        }
      },

      logout: () => {
        // Clear authorization header
        delete api.defaults.headers.common['Authorization'];
        
        // Clear localStorage/zustand store
        localStorage.removeItem('auth-storage');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setAuth: (user: User, token: string) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuthErrors: () => {
        // Method to clear auth errors and reset state
        get().logout();
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // Validate token on app startup
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          
          // Test token validity
          api.get('/auth/me')
            .then((response) => {
              console.log('✅ Token validated successfully');
            })
            .catch((error) => {
              console.warn('⚠️ Stored token is invalid, clearing auth state');
              state.logout();
            });
        }
      },
    }
  )
);