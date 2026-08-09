import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      enum: {
        values: [
          'terrace',
          'basement',
          'bathroom',
          'tank',
          'facade',
          'injection-grouting',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [250, 'Short description cannot exceed 250 characters'],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      required: [true, 'Icon identifier is required'],
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
serviceSchema.index({ category: 1 });
serviceSchema.index({ isPublished: 1, order: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
