import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';
import logger from './src/utils/logger.js';
import { initKeepAlive } from './src/utils/keepAlive.js';
import { globalLimiter, authLimiter } from './src/middleware/rateLimiter.js';
import { getDynamicSitemap } from './src/controllers/sitemapController.js';

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
import segmentRoutes from './src/routes/segmentRoutes.js';
import { mockInterceptor } from './src/middleware/mockInterceptor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test' && process.env.SKIP_DB_CONN !== 'true') {
  connectDB();
}

const app = express();

// Trust proxy headers for rate limiters behind Render/Vercel proxies
app.set('trust proxy', 1);

// 1. Performance Compression (Gzip)
app.use(compression());

// 2. Request Telemetry Logging
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// 3. Global DDoS rate limiter applied to all API paths
app.use('/api', globalLimiter);

// 4. Security Hardening Middlewares
// Apply Helmet headers with strict Content Security Policy (CSP)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://api.fontshare.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://api.fontshare.com', 'https://cdn.fontshare.com'],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        connectSrc: ["'self'"],
      },
    },
  })
);

// Dynamic CORS configurations rejecting wildcards in production
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim().replace(/\/$/, ''))
  : ['http://localhost:5173'];

logger.info(`CORS Whitelisted Origins: ${JSON.stringify(allowedOrigins)}`);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      
      // Permit local development origins, defined production domains, or Vercel subdomains
      const isAllowed = allowedOrigins.includes(origin) || 
        origin.endsWith('.vercel.app') ||
        (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost'));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS origin restrictions'));
      }
    },
    credentials: true, // Required for HttpOnly refresh cookie transfers
  })
);

app.use(mongoSanitize()); // Prevent NoSQL Injection attacks

// 5. Parsers
app.use(cookieParser()); // Read HttpOnly cookies
app.use(express.json()); // Parse JSON body payloads

// Mock data interceptor when database connection is skipped (Local Development/Fast Test)
if (process.env.SKIP_DB_CONN === 'true') {
  app.use('/api', mockInterceptor);
}

// 6. API Route Mapping
// Apply specific auth rate limiter on all auth routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/segments', segmentRoutes);

// Serve Dynamic Sitemap XML
app.get('/sitemap.xml', getDynamicSitemap);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CWF Consulting Corporation API is active and secure',
    timestamp: new Date().toISOString(),
  });
});

// 7. Production Static SPA Asset Serving (Unified Full-Stack Deployments)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/sitemap.xml') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('CWF Consulting Corporation Express REST API is active. Navigate to /api/health for system status.');
  });
}

// 7. Centralized Error Handler (Must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    initKeepAlive();
  });
}

export default app;
