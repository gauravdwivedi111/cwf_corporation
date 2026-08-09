import express from 'express';
import { body } from 'express-validator';
import { login, refresh, logout } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate administrator and return access JWT
 * @access  Public (Rate-limited, Validated)
 */
router.post(
  '/login',
  loginLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required.'),
  ],
  validate,
  login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renew expired access token via httpOnly refresh cookie
 * @access  Public
 */
router.post('/refresh', refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Clear refresh token cookie and invalidate session
 * @access  Public
 */
router.post('/logout', logout);

export default router;
