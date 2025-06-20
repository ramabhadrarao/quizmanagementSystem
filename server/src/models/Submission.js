// server/src/models/Submission.js - Enhanced model with queue support
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
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  code: {
    type: String,
    default: '',
  },
  isCorrect: {
    type: Boolean,
    default: false,
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
      error: String,
    }],
  },
  lastSaved: {
    type: Date,
    default: Date.now,
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
    type: Number,
    default: 0,
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
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'processing', 'completed', 'error'],
    default: 'in_progress',
  },
  queueJobId: {
    type: String,
  },
  errorMessage: {
    type: String,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  autoSaveCount: {
    type: Number,
    default: 0,
  },
  submissionAttempt: {
    type: Number,
    default: 1,
  },
  canRetake: {
    type: Boolean,
    default: false,
  },
  timeTracking: [{
    action: {
      type: String,
      enum: ['start', 'pause', 'resume', 'submit', 'auto_save'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    timeSpent: Number,
  }],
}, {
  timestamps: true,
});

// Indexes for performance
submissionSchema.index({ quiz: 1, user: 1, status: 1 });
submissionSchema.index({ user: 1, status: 1, createdAt: -1 });
submissionSchema.index({ quiz: 1, status: 1, createdAt: -1 });
submissionSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware
submissionSchema.pre('save', function(next) {
  if (this.maxScore > 0) {
    this.percentage = Math.round((this.totalScore / this.maxScore) * 100);
  }
  
  this.lastActivity = new Date();
  
  if (!this.isCompleted && this.isModified('answers')) {
    this.autoSaveCount += 1;
  }
  
  next();
});

// Instance methods
submissionSchema.methods.addTimeTracking = function(action, timeSpent = null) {
  this.timeTracking.push({
    action,
    timestamp: new Date(),
    timeSpent: timeSpent || this.timeSpent,
  });
};

// Static methods
submissionSchema.statics.findActiveSubmission = function(userId, quizId) {
  return this.findOne({
    user: userId,
    quiz: quizId,
    status: { $in: ['in_progress', 'submitted', 'processing'] },
  });
};

submissionSchema.statics.getSubmissionStats = async function(quizId) {
  const stats = await this.aggregate([
    { $match: { quiz: new mongoose.Types.ObjectId(quizId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        averageScore: { $avg: '$percentage' },
        maxScore: { $max: '$percentage' },
        minScore: { $min: '$percentage' },
        averageTime: { $avg: '$timeSpent' },
      }
    }
  ]);
  
  return stats[0] || {
    totalSubmissions: 0,
    averageScore: 0,
    maxScore: 0,
    minScore: 0,
    averageTime: 0,
  };
};

// Virtual for completion status
submissionSchema.virtual('completionStatus').get(function() {
  switch (this.status) {
    case 'in_progress': return 'In Progress';
    case 'submitted': return 'Submitted';
    case 'processing': return 'Processing';
    case 'completed': return 'Completed';
    case 'error': return 'Error';
    default: return 'Unknown';
  }
});

export default mongoose.model('Submission', submissionSchema);