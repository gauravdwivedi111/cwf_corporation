import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientType: {
      type: String,
      required: [true, 'Client type is required'],
      enum: {
        values: ['residential', 'commercial', 'industrial', 'individual'],
        message: '{VALUE} is not a valid client type',
      },
      default: 'individual',
    },
    segment: {
      type: String,
      required: [true, 'Segment is required'],
      enum: {
        values: ['civil', 'web', 'finance'],
        message: '{VALUE} is not a valid segment',
      },
      default: 'civil',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    text: {
      type: String,
      required: [true, 'Testimonial text is required'],
      trim: true,
    },
    projectRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    photo: {
      type: String,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
testimonialSchema.index({ isPublished: 1 });
testimonialSchema.index({ segment: 1 });

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
