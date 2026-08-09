import express from 'express';
import { body } from 'express-validator';
import {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

const blogPostValidationRules = [
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
  body('coverImage')
    .notEmpty()
    .withMessage('Cover image URL is required.')
    .trim(),
  body('content')
    .notEmpty()
    .withMessage('Blog content is required.')
    .trim(),
  body('author')
    .optional()
    .isMongoId()
    .withMessage('Author must be a valid MongoDB ID.'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings.'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean value.'),
  body('seoTitle')
    .optional()
    .isLength({ max: 60 })
    .withMessage('SEO Title cannot exceed 60 characters.')
    .trim(),
  body('seoDescription')
    .optional()
    .isLength({ max: 160 })
    .withMessage('SEO Description cannot exceed 160 characters.')
    .trim(),
];

/**
 * Public Routes
 */
router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

/**
 * Admin / Editor Routes (Gated & Validated)
 */
router.post(
  '/',
  protect,
  authorize('superadmin', 'editor'),
  blogPostValidationRules,
  validate,
  createBlogPost
);

router.put(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  blogPostValidationRules,
  validate,
  updateBlogPost
);

router.delete(
  '/:id',
  protect,
  authorize('superadmin', 'editor'),
  deleteBlogPost
);

export default router;
