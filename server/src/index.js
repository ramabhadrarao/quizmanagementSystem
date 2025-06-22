// server/src/index.js - Complete server setup with analytics
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';
import submissionRoutes from './routes/submissions.js';
import codeExecutionRoutes from './routes/codeExecution.js';
import dashboardRoutes from './routes/dashboard.js';
import analyticsRoutes from './routes/analytics.js';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/users.js'; // New route
import { checkCodeExecutionHealth } from './services/codeExecution.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://43.250.40.133:5175',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-system');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check external services
const checkExternalServices = async () => {
  console.log('🔍 Checking external services...');
  
  // Check code execution service
  const codeExecHealth = await checkCodeExecutionHealth();
  if (codeExecHealth.healthy) {
    console.log('✅ Code Execution Service: Connected');
    console.log(`   URL: ${process.env.CODE_EXECUTION_SERVICE_URL || 'http://localhost:3000/api/v1'}`);
  } else {
    console.warn('⚠️  Code Execution Service: Not available');
    console.warn(`   URL: ${process.env.CODE_EXECUTION_SERVICE_URL || 'http://localhost:3000/api/v1'}`);
    console.warn('   Code execution features will not work until the service is available');
  }
};

// Initialize database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/code', codeExecutionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes); // New route
app.use('/api', healthRoutes);

// Legacy health check endpoint (for backward compatibility)
app.get('/api/health', async (req, res) => {
  const codeExecHealth = await checkCodeExecutionHealth();
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      codeExecution: codeExecHealth.healthy ? 'connected' : 'disconnected'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Quiz Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Check external services after startup
  await checkExternalServices();
  
  console.log('\n📌 Important: Make sure the Code Execution Service is running!');
  console.log(`   Expected at: ${process.env.CODE_EXECUTION_SERVICE_URL || 'http://localhost:3000/api/v1'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await mongoose.connection.close();
  process.exit(0);
});