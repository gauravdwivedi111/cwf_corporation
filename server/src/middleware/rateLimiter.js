import rateLimit from 'express-rate-limit';

/**
 * Limit login requests to 5 attempts per 15 minutes per IP address.
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
 * Limit lead / inquiry submissions to 5 entries per hour per IP address to prevent spam bots.
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
