require('dotenv').config();
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const path = require('path');

// Import routes
const revenueRoutes = require('./routes/revenue');
const expenseRoutes = require('./routes/expenses');
const investmentRoutes = require('./routes/investments');
const summaryRoutes = require('./routes/summaries');
const categoryRoutes = require('./routes/categories');
const salaryRoutes = require('./routes/salaries');

// Create Express app
const app = express();

// Environment configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CSV_DATA_PATH = process.env.CSV_DATA_PATH || './data';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Configure Winston logger
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'funpark-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're not in production then log to the console with a simple format
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:4200', 'https://funpark-57exoneln-geoffroyjanbien-4204s-projects.vercel.app'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0'
  });
});

// API routes
app.use('/api/revenue', revenueRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/salaries', salaryRoutes);

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);

  // Don't leak error details in production
  const isDevelopment = NODE_ENV === 'development';

  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error',
    ...(isDevelopment && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Funpark API server running on port ${PORT}`, {
      environment: NODE_ENV,
      dataPath: CSV_DATA_PATH
    });

    // Ensure data directory exists
    const fs = require('fs');
    if (!fs.existsSync(CSV_DATA_PATH)) {
      fs.mkdirSync(CSV_DATA_PATH, { recursive: true });
      logger.info(`Created data directory: ${CSV_DATA_PATH}`);
    }
  });
}

module.exports = app;