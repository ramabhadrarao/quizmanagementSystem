import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple-choice', 'code'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // Multiple choice specific fields
  options: [{
    type: String,
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be string or number
  },
  // Code question specific fields
  language: {
    type: String,
    enum: ['javascript', 'python', 'cpp', 'c', 'java'],
  },
  testCases: [testCaseSchema],
  starterCode: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    required: true,
    min: 1,
    default: 60, // minutes
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  allowedAttempts: {
    type: Number,
    default: 1,
  },
  showResults: {
    type: Boolean,
    default: true,
  },
  randomizeQuestions: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better query performance
quizSchema.index({ createdBy: 1, isPublished: 1 });
quizSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Quiz', quizSchema);