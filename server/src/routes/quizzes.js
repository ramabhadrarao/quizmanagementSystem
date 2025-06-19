import express from 'express';
import Quiz from '../models/Quiz.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateQuiz } from '../middleware/validation.js';

const router = express.Router();

// Get all quizzes
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let query = {};
    
    // Apply filters
    if (search) {
      query.$text = { $search: search };
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

    res.json({
      quizzes: quizzes.map(quiz => ({
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions,
        timeLimit: quiz.timeLimit,
        isPublished: quiz.isPublished,
        createdBy: quiz.createdBy._id,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
      })),
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
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      isPublished: quiz.isPublished,
      createdBy: quiz.createdBy._id,
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
    const quiz = new Quiz({
      ...req.body,
      createdBy: req.user.userId,
    });

    await quiz.save();

    res.status(201).json({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      isPublished: quiz.isPublished,
      createdBy: quiz.createdBy,
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

    Object.assign(quiz, req.body);
    await quiz.save();

    res.json({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      isPublished: quiz.isPublished,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Error updating quiz' });
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