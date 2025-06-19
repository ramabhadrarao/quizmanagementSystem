export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  QUIZZES: {
    LIST: '/quizzes',
    CREATE: '/quizzes',
    GET: (id: string) => `/quizzes/${id}`,
    UPDATE: (id: string) => `/quizzes/${id}`,
    DELETE: (id: string) => `/quizzes/${id}`,
  },
  SUBMISSIONS: {
    CREATE: '/submissions',
    MY: '/submissions/my',
    GET: (id: string) => `/submissions/${id}`,
  },
  CODE: {
    EXECUTE: '/code/execute',
    TEST: '/code/test',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ACTIVITIES: '/dashboard/activities',
  },
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
} as const;

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  CODE: 'code',
} as const;

export const PROGRAMMING_LANGUAGES = {
  JAVASCRIPT: 'javascript',
  PYTHON: 'python',
  CPP: 'cpp',
  C: 'c',
  JAVA: 'java',
} as const;

export const LANGUAGE_DISPLAY_NAMES = {
  [PROGRAMMING_LANGUAGES.JAVASCRIPT]: 'JavaScript',
  [PROGRAMMING_LANGUAGES.PYTHON]: 'Python',
  [PROGRAMMING_LANGUAGES.CPP]: 'C++',
  [PROGRAMMING_LANGUAGES.C]: 'C',
  [PROGRAMMING_LANGUAGES.JAVA]: 'Java',
} as const;

export const DEFAULT_CODE_TEMPLATES = {
  [PROGRAMMING_LANGUAGES.JAVASCRIPT]: `// Write your solution here
function solution() {
    // Your code here
    return result;
}

console.log(solution());`,
  
  [PROGRAMMING_LANGUAGES.PYTHON]: `# Write your solution here
def solution():
    # Your code here
    return result

print(solution())`,
  
  [PROGRAMMING_LANGUAGES.CPP]: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}`,
  
  [PROGRAMMING_LANGUAGES.C]: `#include <stdio.h>

int main() {
    // Write your solution here
    
    return 0;
}`,
  
  [PROGRAMMING_LANGUAGES.JAVA]: `public class Main {
    public static void main(String[] args) {
        // Write your solution here
        
    }
}`,
} as const;

export const QUIZ_SETTINGS = {
  MIN_TIME_LIMIT: 1, // minutes
  MAX_TIME_LIMIT: 300, // minutes
  DEFAULT_TIME_LIMIT: 60, // minutes
  MIN_POINTS: 1,
  MAX_POINTS: 100,
  DEFAULT_POINTS: 1,
  MIN_OPTIONS: 2,
  MAX_OPTIONS: 6,
} as const;

export const CODE_EXECUTION = {
  TIMEOUT: 10000, // milliseconds
  MEMORY_LIMIT: 128 * 1024 * 1024, // 128MB
  CPU_LIMIT: 50000, // 50% CPU
} as const;