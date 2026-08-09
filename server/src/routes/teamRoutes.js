import express from 'express';
import { body } from 'express-validator';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

const teamValidationRules = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .trim(),
  body('designation')
    .notEmpty()
    .withMessage('Designation is required.')
    .trim(),
  body('photo')
    .notEmpty()
    .withMessage('Photo URL is required.')
    .trim(),
  body('bio')
    .optional()
    .trim(),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer.'),
];

/**
 * Public Routes
 */
router.get('/', getTeamMembers);

/**
 * Admin / Editor Routes (Gated & Validated)
 */
router.post(
  '/',
  protect,
  authorize('superadmin', 'editor'),
  teamValidationRules,
  validate,
  createTeamMember
);

router.put(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  teamValidationRules,
  validate,
  updateTeamMember
);

router.delete(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  deleteTeamMember
);

export default router;
