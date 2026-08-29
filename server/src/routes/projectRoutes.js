import express from 'express';
import { body } from 'express-validator';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate, prePopulateSegment } from '../middleware/validationMiddleware.js';
import Project from '../models/Project.js';

const router = express.Router();

const projectValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required.')
    .trim(),
  body('segment')
    .optional()
    .isIn(['civil', 'web', 'finance'])
    .withMessage('Segment must be one of: civil, web, or finance.'),
  body('location')
    .if((value, { req }) => (req.body.segment || 'civil') === 'civil')
    .notEmpty()
    .withMessage('Location is required for Civil projects.')
    .trim(),
  body('clientType')
    .if((value, { req }) => (req.body.segment || 'civil') === 'civil')
    .isIn(['residential', 'commercial', 'industrial'])
    .withMessage('Client type must be one of: residential, commercial, industrial.'),
  body('serviceCategory')
    .if((value, { req }) => (req.body.segment || 'civil') === 'civil')
    .isIn(['terrace', 'basement', 'bathroom', 'tank', 'facade', 'injection-grouting'])
    .withMessage('Service category must be one of: terrace, basement, bathroom, tank, facade, injection-grouting.'),
  body('sqftTreated')
    .if((value, { req }) => (req.body.segment || 'civil') === 'civil')
    .isFloat({ min: 0 })
    .withMessage('Square footage treated must be a positive number.'),
  body('completionDate')
    .isISO8601()
    .withMessage('Completion date must be a valid ISO8601 date string.'),
  body('description')
    .notEmpty()
    .withMessage('Project description is required.')
    .trim(),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean value.'),
  body('beforeImages')
    .optional()
    .isArray()
    .withMessage('Before images must be an array of image URLs.'),
  body('afterImages')
    .optional()
    .isArray()
    .withMessage('After images must be an array of image URLs.'),
];

/**
 * Public Routes
 */
router.get('/', getProjects);

/**
 * Admin / Editor Routes (Gated & Validated)
 */
router.post(
  '/',
  protect,
  authorize('superadmin', 'editor'),
  projectValidationRules,
  validate,
  createProject
);

router.put(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  prePopulateSegment(Project),
  projectValidationRules,
  validate,
  updateProject
);

router.delete(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  deleteProject
);

export default router;
