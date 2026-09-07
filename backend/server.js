const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { initDb } = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS Configuration (supports local, custom client url, and Vercel deployments)
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      // Allow known origins
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);

      // Allow any vercel.app deployment preview domain
      if (origin.endsWith('.vercel.app') || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Database initialization middleware for serverless invocations
let dbInitPromise = null;
const ensureDbConnected = async (req, res, next) => {
  try {
    if (!dbInitPromise) {
      dbInitPromise = initDb();
    }
    await dbInitPromise;
    next();
  } catch (err) {
    console.error('Database connection error in middleware:', err);
    next();
  }
};
app.use(ensureDbConnected);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'EmployeeHub REST API (Supabase / PostgreSQL)',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root API welcome endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'EmployeeHub REST API',
    endpoints: {
      health: '/api/health',
      employees: '/api/employees',
      stats: '/api/employees/meta/stats',
    },
  });
});

// Mount employee API routes
app.use('/api/employees', employeeRoutes);

// Catch 404 routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

// Start standalone HTTP server when executed directly (not in Vercel serverless)
if (!process.env.VERCEL && require.main === module) {
  const startServer = async () => {
    try {
      await initDb();
      app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(` EmployeeHub Backend (Supabase / PostgreSQL)`);
        console.log(` Port:    http://localhost:${PORT}`);
        console.log(` Health:  http://localhost:${PORT}/api/health`);
        console.log(` API:     http://localhost:${PORT}/api/employees`);
        console.log(` Mode:    ${process.env.NODE_ENV || 'development'}`);
        console.log(`=========================================`);
      });
    } catch (err) {
      console.error('Fatal error starting backend server:', err);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;
