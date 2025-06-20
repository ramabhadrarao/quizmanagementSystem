// server/src/scripts/cleanup.js - Clean up old submissions
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Submission from '../models/Submission.js';

dotenv.config();

async function cleanupOldSubmissions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-system');
    console.log('Connected to MongoDB for cleanup');

    // Clean up inactive submissions older than 24 hours
    const result = await Submission.cleanupInactiveSubmissions();
    
    console.log(`✅ Cleanup completed. Removed ${result} inactive submissions.`);
    
    // Optional: Also clean up submissions older than 30 days that are completed
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldCompleted = await Submission.deleteMany({
      isCompleted: true,
      completedAt: { $lt: thirtyDaysAgo },
    });
    
    console.log(`✅ Removed ${oldCompleted.deletedCount} old completed submissions (30+ days).`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run cleanup
cleanupOldSubmissions();

// Add this to package.json scripts:
// "cleanup": "node src/scripts/cleanup.js"