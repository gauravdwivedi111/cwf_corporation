import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

import connectDB from './src/config/db.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';

// Route imports
import authRoutes from './src/routes/authRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import testimonialRoutes from './src/routes/testimonialRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import inquiryRoutes from './src/routes/inquiryRoutes.js';
import settingRoutes from './src/routes/settingRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test' && process.env.SKIP_DB_CONN !== 'true') {
  connectDB();
}

const app = express();

// 1. Security Hardening Middlewares
app.use(helmet()); // Set secure HTTP headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Required for reading refresh token HttpOnly cookies across origins
  })
);
app.use(mongoSanitize()); // Prevent NoSQL Injection attacks

// 2. Parsers
app.use(cookieParser()); // Read HttpOnly cookies
app.use(express.json()); // Parse JSON body payloads

// 3. API Route Mapping
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CWF Corporation API is active and secure',
    timestamp: new Date().toISOString(),
  });
});

// 4. Centralized Error Handler (Must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
