// server/src/models/Submission.js - Enhanced with auto-save support
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
    }],
  },
  // Auto-save tracking
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
    type: Number, // in seconds
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
  // Auto-save and resume support
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  autoSaveCount: {
    type: Number,
    default: 0,
  },
  // Submission metadata
  submissionAttempt: {
    type: Number,
    default: 1,
  },
  browserInfo: {
    userAgent: String,
    timestamp: Date,
  },
  // Time tracking
  timeTracking: [{
    action: {
      type: String,
      enum: ['start', 'pause', 'resume', 'submit', 'auto_save'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    timeSpent: Number, // cumulative time spent
  }],
}, {
  timestamps: true,
});

// Indexes for better performance
submissionSchema.index({ quiz: 1, user: 1, isCompleted: 1 });
submissionSchema.index({ user: 1, isCompleted: 1, createdAt: -1 });
submissionSchema.index({ quiz: 1, isCompleted: 1, createdAt: -1 });

// Pre-save middleware to calculate percentage and update activity
submissionSchema.pre('save', function(next) {
  // Calculate percentage
  if (this.maxScore > 0) {
    this.percentage = Math.round((this.totalScore / this.maxScore) * 100);
  }
  
  // Update last activity
  this.lastActivity = new Date();
  
  // Track auto-save
  if (!this.isCompleted && this.isModified('answers')) {
    this.autoSaveCount += 1;
  }
  
  next();
});

// Method to check if submission is still active (not timed out)
submissionSchema.methods.isActive = function() {
  if (this.isCompleted) return false;
  
  // Consider inactive if no activity for 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  return this.lastActivity > thirtyMinutesAgo;
};

// Method to get time remaining (if quiz has time limit)
submissionSchema.methods.getTimeRemaining = function(quizTimeLimit) {
  if (this.isCompleted) return 0;
  
  const timeAllowedInSeconds = quizTimeLimit * 60; // Convert minutes to seconds
  const timeElapsed = this.timeSpent || 0;
  const timeRemaining = Math.max(0, timeAllowedInSeconds - timeElapsed);
  
  return timeRemaining;
};

// Method to check if user can resume this submission
submissionSchema.methods.canResume = function() {
  return !this.isCompleted && this.isActive();
};

// Method to add time tracking entry
submissionSchema.methods.addTimeTracking = function(action, timeSpent = null) {
  this.timeTracking.push({
    action,
    timestamp: new Date(),
    timeSpent: timeSpent || this.timeSpent,
  });
};

// Static method to find active submission for user
submissionSchema.statics.findActiveSubmission = function(userId, quizId) {
  return this.findOne({
    user: userId,
    quiz: quizId,
    isCompleted: false,
  });
};

// Static method to cleanup old inactive submissions (can be run as a cron job)
submissionSchema.statics.cleanupInactiveSubmissions = async function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const result = await this.deleteMany({
    isCompleted: false,
    lastActivity: { $lt: oneDayAgo },
  });
  
  console.log(`🧹 Cleaned up ${result.deletedCount} inactive submissions`);
  return result.deletedCount;
};

// Virtual for getting formatted time spent
submissionSchema.virtual('formattedTimeSpent').get(function() {
  const seconds = this.timeSpent || 0;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
});

// Virtual for getting completion status
submissionSchema.virtual('completionStatus').get(function() {
  if (this.isCompleted) return 'completed';
  if (!this.isActive()) return 'expired';
  return 'in_progress';
});

// Remove sensitive data from JSON output
submissionSchema.methods.toJSON = function() {
  const submissionObject = this.toObject();
  
  // Remove sensitive execution details for students
  if (submissionObject.answers) {
    submissionObject.answers = submissionObject.answers.map(answer => ({
      questionId: answer.questionId,
      type: answer.type,
      answer: answer.answer,
      code: answer.code,
      isCorrect: answer.isCorrect,
      score: answer.score,
      // Only include basic execution result, not detailed test cases
      executionResult: answer.executionResult ? {
        output: answer.executionResult.output,
        error: answer.executionResult.error,
        hasTestResults: !!(answer.executionResult.testResults && answer.executionResult.testResults.length > 0),
        passedTests: answer.executionResult.testResults ? answer.executionResult.testResults.filter(t => t.passed).length : 0,
        totalTests: answer.executionResult.testResults ? answer.executionResult.testResults.length : 0,
      } : null,
    }));
  }
  
  return submissionObject;
};

export default mongoose.model('Submission', submissionSchema);