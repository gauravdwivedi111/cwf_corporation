import express from 'express';
import { body } from 'express-validator';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public lead creation validation checks
const inquiryCreateRules = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .trim(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required.')
    .trim()
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage('Please provide a valid phone number.'),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('segment')
    .optional()
    .isIn(['civil', 'web', 'finance'])
    .withMessage('Segment must be one of: civil, web, or finance.'),
  body('segmentDetails')
    .optional()
    .custom((value) => {
      if (value !== null && typeof value !== 'object') {
        throw new Error('segmentDetails must be an object.');
      }
      return true;
    }),
  body('propertyType')
    .if((value, { req }) => (req.body.segment || 'civil') === 'civil')
    .isIn(['residential', 'commercial', 'industrial', 'other'])
    .withMessage('Property type must be: residential, commercial, industrial, or other.'),
  body('serviceInterested')
    .if((value, { req }) => (req.body.segment || 'civil') === 'civil')
    .isIn(['terrace', 'basement', 'bathroom', 'tank', 'facade', 'injection-grouting', 'other'])
    .withMessage('Service category must be one of CWF service types, or "other".'),
  body('message')
    .notEmpty()
    .withMessage('Message is required.')
    .trim(),
  body('source')
    .optional()
    .isIn(['website-form', 'phone', 'referral', 'social-media', 'other'])
    .withMessage('Source must be one of: website-form, phone, referral, social-media, other.'),
];

// Admin patch inquiry validation checks
const inquiryUpdateRules = [
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'site-visit-scheduled', 'quoted', 'converted', 'closed'])
    .withMessage('Status must be: new, contacted, site-visit-scheduled, quoted, converted, or closed.'),
  body('note')
    .optional()
    .isString()
    .trim(),
  body('assignedTo')
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage('assignedTo must be a valid MongoDB ID or null.'),
];

/**
 * Public Lead Submission Form (Rate-limited)
 */
router.post('/', inquiryLimiter, inquiryCreateRules, validate, createInquiry);

/**
 * Admin Lead Management (Gated & Validated)
 */
router.get(
  '/',
  protect,
  authorize('superadmin', 'editor'),
  getInquiries
);

router.patch(
  '/:id/status',
  protect,
  authorize('superadmin', 'editor'),
  inquiryUpdateRules,
  validate,
  updateInquiryStatus
);

export default router;
