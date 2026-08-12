import BlogPost from '../models/BlogPost.js';
import sanitizeHtml from 'sanitize-html';

/**
 * @desc    Get all published blog posts
 * @route   GET /api/blog
 * @access  Public
 */
export const getBlogPosts = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isPublished: true };

    // Parse query parameters for pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Retrieve total matching document counts
    const total = await BlogPost.countDocuments(filter);

    const blogPosts = await BlogPost.find(filter)
      .populate('author', 'email role')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: blogPosts.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: blogPosts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get blog post by slug
 * @route   GET /api/blog/:slug
 * @access  Public
 */
export const getBlogPostBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const blogPost = await BlogPost.findOne({ slug, isPublished: true }).populate(
      'author',
      'email role'
    );

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: `Blog post not found with slug: '${slug}'`,
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new blog post
 * @route   POST /api/blog
 * @access  Private (Admin/Editor)
 */
export const createBlogPost = async (req, res, next) => {
  try {
    // Sanitize rich-text content input to block stored XSS
    if (req.body.content) {
      req.body.content = sanitizeHtml(req.body.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': ['src', 'alt'],
          'a': ['href', 'target', 'rel']
        }
      });
    }
    // Automatically set author if not explicitly supplied
    if (!req.body.author) {
      req.body.author = req.user._id;
    }

    // Set publishedAt if the article is published directly
    if (req.body.isPublished && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }

    const blogPost = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a blog post
 * @route   PUT /api/blog/:id
 * @access  Private (Admin/Editor)
 */
export const updateBlogPost = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Sanitize rich-text content input to block stored XSS
    if (req.body.content) {
      req.body.content = sanitizeHtml(req.body.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': ['src', 'alt'],
          'a': ['href', 'target', 'rel']
        }
      });
    }
    // Dynamically manage published timestamp on publish/unpublish toggle
    if (req.body.isPublished === true) {
      req.body.publishedAt = req.body.publishedAt || new Date();
    } else if (req.body.isPublished === false) {
      req.body.publishedAt = null;
    }

    const blogPost = await BlogPost.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: `Blog post not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blog/:id
 * @access  Private (Admin/Editor)
 */
export const deleteBlogPost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const blogPost = await BlogPost.findByIdAndDelete(id);
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: `Blog post not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
