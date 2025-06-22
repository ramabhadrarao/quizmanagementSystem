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
  quizCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
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
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  requiresAuthentication: {
    type: Boolean,
    default: true,
  },
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Index for better query performance
quizSchema.index({ createdBy: 1, isPublished: 1 });
quizSchema.index({ title: 'text', description: 'text' });
quizSchema.index({ quizCode: 1 });

// Generate unique quiz code
quizSchema.statics.generateUniqueCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if code already exists
    const existing = await this.findOne({ quizCode: code });
    if (!existing) {
      isUnique = true;
    }
  }
  
  return code;
};

export default mongoose.model('Quiz', quizSchema);