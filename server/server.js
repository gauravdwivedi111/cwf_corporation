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

// Mock data interceptor when database connection is skipped
if (process.env.SKIP_DB_CONN === 'true') {
  app.use('/api', (req, res, next) => {
    if (req.method === 'GET') {
      if (req.path === '/services') {
        return res.status(200).json({
          success: true,
          count: 1,
          data: [{
            _id: '660c1b48b1a45b85a3000001',
            title: 'Terrace Waterproofing',
            slug: 'terrace-waterproofing',
            category: 'terrace',
            shortDescription: 'Full terrace repair and chemical lining options.',
            fullDescription: 'Detailed polyurethane inspection and concrete coating application.',
            coverImage: 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg',
            icon: 'droplet',
            isPublished: true,
            order: 1
          }]
        });
      }
      if (req.path === '/services/terrace-waterproofing') {
        return res.status(200).json({
          success: true,
          data: {
            _id: '660c1b48b1a45b85a3000001',
            title: 'Terrace Waterproofing',
            slug: 'terrace-waterproofing',
            category: 'terrace',
            shortDescription: 'Full terrace repair and chemical lining options.',
            fullDescription: 'Detailed polyurethane inspection and concrete coating application.',
            coverImage: 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg',
            icon: 'droplet',
            isPublished: true,
            order: 1
          }
        });
      }
      if (req.path === '/testimonials') {
        return res.status(200).json({
          success: true,
          count: 1,
          data: [{
            _id: '660c1b48b1a45b85a3000002',
            clientName: 'Rajesh Patil',
            clientType: 'residential',
            text: 'Highly technical crew. The slab inspection detected moisture pathway precisely.',
            rating: 5,
            photo: 'https://res.cloudinary.com/demo/image/upload/w_100,h_100/sample.jpg',
            isPublished: true
          }]
        });
      }
      if (req.path === '/settings') {
        return res.status(200).json({
          success: true,
          data: {
            companyPhone: '+91 20 1234 5678',
            companyEmail: 'info@cwfcorporation.com',
            address: {
              street: '101, Apex Commercial Hub, MG Road',
              city: 'Pune',
              pincode: '411001',
              country: 'India'
            },
            businessHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
            socialLinks: {
              facebook: 'https://facebook.com/cwfcorporation',
              instagram: 'https://instagram.com/cwfcorporation',
              linkedin: 'https://linkedin.com/company/cwfcorporation'
            }
          }
        });
      }
      if (req.path === '/projects') {
        return res.status(200).json({
          success: true,
          count: 1,
          data: [{
            _id: '660c1b48b1a45b85a3000003',
            title: 'Terrace Slab Waterproofing & Leakage Repair',
            location: 'Kothrud, Pune',
            clientType: 'residential',
            serviceCategory: 'terrace',
            description: 'Active slab seepage resolved using scientific polyurethane injection.',
            beforeImages: ['https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg'],
            afterImages: ['https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg'],
            sqftTreated: 2500,
            completionDate: '2026-08-01T00:00:00.000Z',
            isFeatured: true
          }]
        });
      }
      if (req.path === '/team') {
        return res.status(200).json({
          success: true,
          count: 1,
          data: [{
            _id: '660c1b48b1a45b85a3000004',
            name: 'Vikram Shinde',
            designation: 'Senior Structural Auditor',
            photo: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg',
            bio: '12 years waterproofing inspection experience.',
            order: 1
          }]
        });
      }
      if (req.path === '/blog') {
        return res.status(200).json({
          success: true,
          count: 1,
          data: [{
            _id: '660c1b48b1a45b85a3000005',
            title: 'Identifying Concrete Slab Leaks',
            slug: 'identifying-concrete-slab-leaks',
            content: '<p>Standard concrete is porous...</p>',
            coverImage: 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg',
            publishedAt: '2026-08-01T00:00:00.000Z',
            author: { role: 'superadmin' }
          }]
        });
      }
    }
    next();
  });
}

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

app.get('/', (req, res) => {
  res.send('CWF Corporation Express REST API is active. Navigate to /api/health for system status.');
});

// 4. Centralized Error Handler (Must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
