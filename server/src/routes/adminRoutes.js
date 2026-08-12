import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getStaffUsers,
  createStaffUser,
  updateUserStatus,
  uploadFile,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply auth protection to all administrative sub-routes globally
router.use(protect);

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Fetch statistical distribution of leads & most-viewed services
 * @access  Private (Admin/Editor)
 */
router.get(
  '/dashboard/stats',
  authorize('superadmin', 'editor'),
  getDashboardStats
);

/**
 * @route   POST /api/admin/upload
 * @desc    Upload media assets directly to Cloudinary (size < 5MB, format check)
 * @access  Private (Admin/Editor)
 */
router.post(
  '/upload',
  authorize('superadmin', 'editor'),
  upload.single('image'),
  uploadFile
);

// Staff creation validation checks
const userCreateRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  body('role')
    .optional()
    .isIn(['superadmin', 'editor'])
    .withMessage('Role must be either superadmin or editor.'),
];

// Staff status toggle validation checks
const userStatusRules = [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value.'),
];

/**
 * @route   GET /api/admin/users
 * @desc    Fetch all staff profiles
 * @access  Private (Admin/Editor)
 */
router.get(
  '/users',
  authorize('superadmin', 'editor'),
  getStaffUsers
);

/**
 * @route   POST /api/admin/users
 * @desc    Create new staff credentials
 * @access  Private (Superadmin only)
 */
router.post(
  '/users',
  authorize('superadmin'),
  userCreateRules,
  validate,
  createStaffUser
);

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Activate or deactivate a staff profile
 * @access  Private (Superadmin only)
 */
router.patch(
  '/users/:id/status',
  authorize('superadmin'),
  userStatusRules,
  validate,
  updateUserStatus
);

export default router;
