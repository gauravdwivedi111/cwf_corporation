import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter applied to all /api endpoints.
 * Guards against basic Denial of Service (DoS) attempts.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Broad auth limiter applied to all /api/auth/* endpoints.
 * Prevents rapid session requests and route flooding.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window across auth routes
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict login brute-force limiter specifically for POST /api/auth/login.
 * Restricts login failures to 5 attempts per 15 minutes.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict inquiry spam protector for POST /api/inquiries.
 * Restricts leads submission to 5 entries per hour per IP.
 */
export const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: 'Too many inquiries submitted from this IP. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
