import express from 'express';
import { body } from 'express-validator';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

const settingsValidationRules = [
  body('companyPhone')
    .notEmpty()
    .withMessage('Company phone number is required.')
    .trim(),
  body('companyEmail')
    .isEmail()
    .withMessage('Please provide a valid company email.')
    .normalizeEmail(),
  body('address.street')
    .notEmpty()
    .withMessage('Street address is required.')
    .trim(),
  body('address.city')
    .notEmpty()
    .withMessage('City is required.')
    .trim(),
  body('address.state')
    .notEmpty()
    .withMessage('State is required.')
    .trim(),
  body('address.pincode')
    .notEmpty()
    .withMessage('Pincode is required.')
    .trim(),
  body('address.country')
    .optional()
    .trim(),
  body('businessHours')
    .notEmpty()
    .withMessage('Business hours description is required.')
    .trim(),
  body('aboutText')
    .notEmpty()
    .withMessage('About text is required.')
    .trim(),
  body('socialLinks.facebook')
    .optional()
    .trim(),
  body('socialLinks.instagram')
    .optional()
    .trim(),
  body('socialLinks.linkedin')
    .optional()
    .trim(),
  body('socialLinks.twitter')
    .optional()
    .trim(),
  body('socialLinks.youtube')
    .optional()
    .trim(),
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array of strings.'),
];

/**
 * Public Route
 */
router.get('/', getSettings);

/**
 * Admin Route (Superadmin only, gated and validated)
 */
router.put(
  '/',
  protect,
  authorize('superadmin'),
  settingsValidationRules,
  validate,
  updateSettings
);

export default router;
