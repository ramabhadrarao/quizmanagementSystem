// server/src/routes/health.js - Health check route
import express from 'express';
import mongoose from 'mongoose';
import { checkCodeExecutionHealth } from '../services/codeExecution.js';
import { getQueueStats } from '../services/submissionQueue.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check code execution service
    const codeExecutionStatus = await checkCodeExecutionHealth();
    
    // Check Redis queue stats
    let queueStatus = 'unknown';
    let queueStats = null;
    try {
      queueStats = await getQueueStats();
      queueStatus = 'connected';
    } catch (error) {
      queueStatus = 'disconnected';
    }
    
    // Overall health status
    const isHealthy = dbStatus === 'connected' && codeExecutionStatus.healthy;
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        codeExecution: {
          status: codeExecutionStatus.healthy ? 'connected' : 'disconnected',
          url: process.env.CODE_EXECUTION_SERVICE_URL || 'not configured',
          ...codeExecutionStatus
        },
        redis: {
          status: queueStatus,
          ...(queueStats && { queue: queueStats })
        }
      },
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Detailed health check
router.get('/health/detailed', async (req, res) => {
  try {
    const details = {
      timestamp: new Date().toISOString(),
      services: {},
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        node: process.version,
        platform: process.platform
      }
    };
    
    // MongoDB details
    try {
      const dbStats = await mongoose.connection.db.admin().ping();
      details.services.mongodb = {
        status: 'connected',
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      };
    } catch (error) {
      details.services.mongodb = {
        status: 'error',
        error: error.message
      };
    }
    
    // Code execution service details
    details.services.codeExecution = await checkCodeExecutionHealth();
    
    // Queue details
    try {
      const queueStats = await getQueueStats();
      details.services.queue = {
        status: 'connected',
        stats: queueStats
      };
    } catch (error) {
      details.services.queue = {
        status: 'error',
        error: error.message
      };
    }
    
    res.json(details);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;