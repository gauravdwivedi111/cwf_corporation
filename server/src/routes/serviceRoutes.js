import express from 'express';
import { body } from 'express-validator';
import {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate, prePopulateSegment } from '../middleware/validationMiddleware.js';
import Service from '../models/Service.js';

const router = express.Router();

// Shared validation rules for creating and updating services
const serviceValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required.')
    .trim(),
  body('slug')
    .notEmpty()
    .withMessage('Slug is required.')
    .matches(/^[a-z0-9-_]+$/)
    .withMessage('Slug must consist of lowercase letters, numbers, hyphens, and underscores only.')
    .trim(),
  body('segment')
    .optional()
    .isIn(['civil', 'web', 'finance'])
    .withMessage('Segment must be one of: civil, web, or finance.'),
  body('category')
    .notEmpty()
    .withMessage('Category is required.')
    .custom((value, { req }) => {
      const segment = req.body.segment || 'civil';
      if (segment === 'civil') {
        const allowed = ['terrace', 'basement', 'bathroom', 'tank', 'facade', 'injection-grouting'];
        if (!allowed.includes(value)) {
          throw new Error(`Category must be one of: ${allowed.join(', ')} for Civil segment.`);
        }
      } else if (segment === 'web') {
        const allowed = ['e-commerce', 'corporate-site', 'web-app', 'seo-maintenance', 'custom-development'];
        if (!allowed.includes(value)) {
          throw new Error(`Category must be one of: ${allowed.join(', ')} for Web segment.`);
        }
      } else if (segment === 'finance') {
        const allowed = ['business-loan', 'personal-loan', 'investment-advisory', 'tax-consultancy', 'working-capital'];
        if (!allowed.includes(value)) {
          throw new Error(`Category must be one of: ${allowed.join(', ')} for Finance segment.`);
        }
      } else {
        throw new Error(`Invalid segment: ${segment}`);
      }
      return true;
    }),
  body('shortDescription')
    .notEmpty()
    .withMessage('Short description is required.')
    .isLength({ max: 250 })
    .withMessage('Short description cannot exceed 250 characters.')
    .trim(),
  body('fullDescription')
    .notEmpty()
    .withMessage('Full description is required.')
    .trim(),
  body('coverImage')
    .notEmpty()
    .withMessage('Cover image URL is required.')
    .trim(),
  body('icon')
    .notEmpty()
    .withMessage('Icon identifier is required.')
    .trim(),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer.'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean value.'),
];

/**
 * Public Routes
 */
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

/**
 * Admin / Editor Routes (Gated & Validated)
 */
router.post(
  '/',
  protect,
  authorize('superadmin', 'editor'),
  serviceValidationRules,
  validate,
  createService
);

router.put(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  prePopulateSegment(Service),
  serviceValidationRules,
  validate,
  updateService
);

router.delete(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  deleteService
);

export default router;
