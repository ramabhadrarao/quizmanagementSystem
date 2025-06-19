import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'code'],
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, number, etc.
  },
  code: {
    type: String,
  },
  isCorrect: {
    type: Boolean,
  },
  score: {
    type: Number,
    default: 0,
  },
  executionResult: {
    output: String,
    error: String,
    testResults: [{
      passed: Boolean,
      input: String,
      expectedOutput: String,
      actualOutput: String,
    }],
  },
});

const submissionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [answerSchema],
  totalScore: {
    type: Number,
    default: 0,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  timeSpent: {
    type: Number, // in seconds
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index for unique submissions per user per quiz (if single attempt)
submissionSchema.index({ quiz: 1, user: 1 });

// Calculate percentage before saving
submissionSchema.pre('save', function(next) {
  if (this.maxScore > 0) {
    this.percentage = Math.round((this.totalScore / this.maxScore) * 100);
  }
  next();
});

export default mongoose.model('Submission', submissionSchema);