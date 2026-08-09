import express from 'express';
import { body } from 'express-validator';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

const testimonialValidationRules = [
  body('clientName')
    .notEmpty()
    .withMessage('Client name is required.')
    .trim(),
  body('clientType')
    .isIn(['residential', 'commercial', 'industrial', 'individual'])
    .withMessage('Client type must be one of: residential, commercial, industrial, individual.'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.'),
  body('text')
    .notEmpty()
    .withMessage('Testimonial text is required.')
    .trim(),
  body('projectRef')
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage('Project reference must be a valid MongoDB ID.'),
  body('photo')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean value.'),
];

/**
 * Public Routes
 */
router.get('/', getTestimonials);

/**
 * Admin / Editor Routes (Gated & Validated)
 */
router.post(
  '/',
  protect,
  authorize('superadmin', 'editor'),
  testimonialValidationRules,
  validate,
  createTestimonial
);

router.put(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  testimonialValidationRules,
  validate,
  updateTestimonial
);

router.delete(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  deleteTestimonial
);

export default router;
