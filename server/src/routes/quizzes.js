import express from 'express';
import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateQuiz } from '../middleware/validation.js';

const router = express.Router();

// Get all quizzes
// Get all quizzes
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let query = {};
    
    // Apply filters
    if (search) {
      // Students shouldn't be able to search by quiz code
      if (req.user.role === 'student') {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      } else {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { quizCode: { $regex: search, $options: 'i' } },
        ];
      }
    }
    
    if (status === 'published') {
      query.isPublished = true;
    } else if (status === 'draft') {
      query.isPublished = false;
    }
    
    // Students can only see published quizzes
    if (req.user.role === 'student') {
      query.isPublished = true;
    }

    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Quiz.countDocuments(query);

    // Get user's submissions if student
    let userSubmissions = [];
    if (req.user.role === 'student') {
      userSubmissions = await Submission.find({ 
        user: req.user.userId 
      }).select('quiz status percentage completedAt');
    }

    // Format quiz data based on user role
    const quizData = await Promise.all(quizzes.map(async (quiz) => {
      const quizObj = {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions,
        timeLimit: quiz.timeLimit,
        isPublished: quiz.isPublished,
        createdBy: quiz.createdBy,
        startDate: quiz.startDate,
        endDate: quiz.endDate,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
      };
      
      // Only include quiz code for instructors/admins
      if (req.user.role !== 'student') {
        quizObj.quizCode = quiz.quizCode;
      } else {
        // For students, add their submission status
        const submission = userSubmissions.find(
          sub => sub.quiz.toString() === quiz._id.toString()
        );
        if (submission) {
          quizObj.userSubmission = {
            status: submission.status,
            percentage: submission.percentage,
            completedAt: submission.completedAt
          };
        }
      }
      
      return quizObj;
    }));

    res.json({
      quizzes: quizData,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
});

// Verify quiz code (for students)
router.post('/verify-code', requireAuth, async (req, res) => {
  try {
    const { quizCode } = req.body;
    
    if (!quizCode) {
      return res.status(400).json({ message: 'Quiz code is required' });
    }
    
    const quiz = await Quiz.findOne({ 
      quizCode: quizCode.toUpperCase(),
      isPublished: true 
    }).populate('createdBy', 'name email');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Invalid quiz code or quiz not published' });
    }
    
    // Check if quiz is within date range
    const now = new Date();
    if (quiz.startDate && now < quiz.startDate) {
      return res.status(400).json({ 
        message: 'Quiz has not started yet',
        startDate: quiz.startDate 
      });
    }
    
    if (quiz.endDate && now > quiz.endDate) {
      return res.status(400).json({ 
        message: 'Quiz has ended',
        endDate: quiz.endDate 
      });
    }
    
    res.json({
      quiz: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions: quiz.questions.length,
        createdBy: quiz.createdBy,
      },
    });
  } catch (error) {
    console.error('Error verifying quiz code:', error);
    res.status(500).json({ message: 'Error verifying quiz code' });
  }
});

// Get single quiz
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Students can only access published quizzes
    if (req.user.role === 'student' && !quiz.isPublished) {
      return res.status(403).json({ message: 'This quiz is not available' });
    }

    res.json({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      quizCode: quiz.quizCode,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      isPublished: quiz.isPublished,
      createdBy: quiz.createdBy,
      startDate: quiz.startDate,
      endDate: quiz.endDate,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Error fetching quiz' });
  }
});

// Create quiz
router.post('/', requireAuth, requireRole(['admin', 'instructor']), validateQuiz, async (req, res) => {
  try {
    // Generate unique quiz code
    const quizCode = await Quiz.generateUniqueCode();
    
    const quiz = new Quiz({
      ...req.body,
      quizCode,
      createdBy: req.user.userId,
    });

    await quiz.save();

    res.status(201).json({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      quizCode: quiz.quizCode,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      isPublished: quiz.isPublished,
      createdBy: quiz.createdBy,
      startDate: quiz.startDate,
      endDate: quiz.endDate,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Error creating quiz' });
  }
});

// Update quiz
router.put('/:id', requireAuth, requireRole(['admin', 'instructor']), validateQuiz, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user owns the quiz (instructors can only edit their own quizzes)
    if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own quizzes' });
    }

    // Don't allow changing quiz code
    delete req.body.quizCode;
    
    Object.assign(quiz, req.body);
    await quiz.save();

    res.json({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      quizCode: quiz.quizCode,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      isPublished: quiz.isPublished,
      createdBy: quiz.createdBy,
      startDate: quiz.startDate,
      endDate: quiz.endDate,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Error updating quiz' });
  }
});

// Regenerate quiz code
router.post('/:id/regenerate-code', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user owns the quiz
    if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only modify your own quizzes' });
    }

    // Generate new unique code
    quiz.quizCode = await Quiz.generateUniqueCode();
    await quiz.save();

    res.json({ 
      message: 'Quiz code regenerated successfully',
      quizCode: quiz.quizCode 
    });
  } catch (error) {
    console.error('Error regenerating quiz code:', error);
    res.status(500).json({ message: 'Error regenerating quiz code' });
  }
});

// Delete quiz
router.delete('/:id', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user owns the quiz (instructors can only delete their own quizzes)
    if (req.user.role === 'instructor' && quiz.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own quizzes' });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Error deleting quiz' });
  }
});

export default router;