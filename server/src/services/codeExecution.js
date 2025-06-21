// server/src/services/codeExecution.js - Updated to use external code execution server
import axios from 'axios';

// Configure the external code execution service URL
const CODE_EXECUTION_SERVICE_URL = process.env.CODE_EXECUTION_SERVICE_URL || 'http://localhost:3000/api/v1';

// Language mapping between quiz system and code execution service
const LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  cpp: 'cpp',
  c: 'c',
  java: 'java'
};

/**
 * Execute code using the external code execution service
 * @param {string} code - The code to execute
 * @param {string} language - Programming language
 * @param {Array} testCases - Array of test cases
 * @param {string} input - Input for the program (optional)
 * @returns {Promise<Object>} Execution result
 */
export async function executeCode(code, language, testCases = [], input = '') {
  try {
    console.log(`🔄 Sending code execution request to external service: ${language}`);
    
    // Map language to external service format
    const mappedLanguage = LANGUAGE_MAP[language] || language;
    
    // Prepare request payload
    const payload = {
      code,
      language: mappedLanguage,
      timeout: 10000 // 10 seconds timeout
    };
    
    // Add test cases or input
    if (testCases && testCases.length > 0) {
      // Convert test cases to external service format
      payload.testCases = testCases.map(tc => ({
        input: tc.input || '',
        expectedOutput: tc.expectedOutput || ''
      }));
    } else if (input) {
      payload.input = input;
    }
    
    // Make request to external code execution service
    const response = await axios.post(`${CODE_EXECUTION_SERVICE_URL}/execute`, payload, {
      timeout: 60000, // 60 second timeout for the HTTP request
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`✅ Code execution completed: ${response.data.executionId}`);
    
    // Transform response to match quiz system format
    const result = transformExecutionResponse(response.data, testCases);
    
    return result;
  } catch (error) {
    console.error('❌ Code execution service error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Code execution service is unavailable. Please ensure it is running.');
    }
    
    if (error.response?.data) {
      // Return error from execution service
      return {
        output: '',
        error: error.response.data.error || error.response.data.message || 'Code execution failed',
        testResults: testCases.map(tc => ({
          passed: false,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: '',
          error: 'Execution failed'
        })),
        executionTime: 0,
        executionId: error.response.data.executionId || `error-${Date.now()}`,
      };
    }
    
    throw new Error(`Code execution service error: ${error.message}`);
  }
}

/**
 * Transform external service response to match quiz system format
 */
function transformExecutionResponse(serviceResponse, originalTestCases) {
  const result = {
    output: serviceResponse.stdout || '',
    error: serviceResponse.stderr || serviceResponse.error || '',
    executionTime: serviceResponse.executionTime || 0,
    executionId: serviceResponse.executionId,
  };
  
  // Handle test case results
  if (serviceResponse.testResults && serviceResponse.testResults.length > 0) {
    result.testResults = serviceResponse.testResults.map((testResult, index) => {
      const originalTestCase = originalTestCases[index] || {};
      
      return {
        passed: testResult.passed || false,
        input: testResult.input || originalTestCase.input || '',
        expectedOutput: testResult.expectedOutput || originalTestCase.expectedOutput || '',
        actualOutput: testResult.actualOutput || '',
        error: testResult.stderr || testResult.error || '',
        executionTime: testResult.executionTime
      };
    });
    
    // Add summary statistics
    result.allPassed = serviceResponse.allPassed || false;
    result.passedCount = serviceResponse.passedCount || 0;
    result.totalCount = serviceResponse.totalCount || result.testResults.length;
  } else if (originalTestCases && originalTestCases.length > 0) {
    // If service didn't return test results but we have test cases,
    // create results based on simple output comparison
    result.testResults = originalTestCases.map(tc => {
      const actualOutput = (result.output || '').trim();
      const expectedOutput = (tc.expectedOutput || '').trim();
      const passed = actualOutput === expectedOutput && !result.error;
      
      return {
        passed,
        input: tc.input || '',
        expectedOutput: expectedOutput,
        actualOutput: actualOutput,
        error: result.error
      };
    });
  }
  
  return result;
}

/**
 * Get supported languages from the external service
 */
export async function getSupportedLanguages() {
  try {
    const response = await axios.get(`${CODE_EXECUTION_SERVICE_URL}/languages`, {
      timeout: 5000
    });
    
    return response.data.languages || [];
  } catch (error) {
    console.error('Failed to fetch supported languages:', error.message);
    
    // Return default languages if service is unavailable
    return [
      { id: 'python', name: 'Python', version: '3.11' },
      { id: 'javascript', name: 'JavaScript', version: 'Node.js 20' },
      { id: 'cpp', name: 'C++', version: 'GCC 12' },
      { id: 'c', name: 'C', version: 'GCC 12' },
      { id: 'java', name: 'Java', version: 'OpenJDK 17' }
    ];
  }
}

/**
 * Get execution statistics from the external service
 */
export async function getExecutionStats() {
  try {
    const response = await axios.get(`${CODE_EXECUTION_SERVICE_URL}/stats`, {
      timeout: 5000
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch execution stats:', error.message);
    return null;
  }
}

/**
 * Health check for the external code execution service
 */
export async function checkCodeExecutionHealth() {
  try {
    const response = await axios.get(`${CODE_EXECUTION_SERVICE_URL.replace('/api/v1', '')}/health`, {
      timeout: 5000
    });
    
    return {
      healthy: response.data.status === 'healthy',
      ...response.data
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}