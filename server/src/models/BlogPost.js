import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    seoTitle: {
      type: String,
      maxlength: [60, 'SEO title cannot exceed 60 characters'],
      trim: true,
    },
    seoDescription: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
blogPostSchema.index({ isPublished: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
