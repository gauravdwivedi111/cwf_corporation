import BlogPost from '../models/BlogPost.js';

/**
 * @desc    Get all published blog posts
 * @route   GET /api/blog
 * @access  Public
 */
export const getBlogPosts = async (req, res, next) => {
  try {
    const blogPosts = await BlogPost.find({ isPublished: true })
      .populate('author', 'email role')
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      count: blogPosts.length,
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
