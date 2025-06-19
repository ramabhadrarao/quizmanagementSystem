import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { executeCode } from '../services/codeExecution.js';

const router = express.Router();

// Execute code
router.post('/execute', requireAuth, async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    const result = await executeCode(code, language, [], input);
    
    res.json(result);
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      message: 'Code execution failed',
      error: error.message,
    });
  }
});

// Test code against test cases
router.post('/test', requireAuth, async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!code || !language || !testCases) {
      return res.status(400).json({ 
        message: 'Code, language, and test cases are required' 
      });
    }

    const result = await executeCode(code, language, testCases);
    
    res.json(result);
  } catch (error) {
    console.error('Code testing error:', error);
    res.status(500).json({
      message: 'Code testing failed',
      error: error.message,
    });
  }
});

export default router;