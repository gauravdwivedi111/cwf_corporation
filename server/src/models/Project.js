import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Project location is required'],
      trim: true,
    },
    clientType: {
      type: String,
      required: [true, 'Client type is required'],
      enum: {
        values: ['residential', 'commercial', 'industrial'],
        message: '{VALUE} is not a valid client type',
      },
    },
    serviceCategory: {
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
        message: '{VALUE} is not a valid service category',
      },
    },
    beforeImages: {
      type: [String],
      default: [],
    },
    afterImages: {
      type: [String],
      default: [],
    },
    sqftTreated: {
      type: Number,
      required: [true, 'Square footage treated is required'],
      min: [0, 'Square footage cannot be negative'],
    },
    completionDate: {
      type: Date,
      required: [true, 'Completion date is required'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
projectSchema.index({ isFeatured: 1 });
projectSchema.index({ serviceCategory: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
