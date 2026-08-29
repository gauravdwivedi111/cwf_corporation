import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
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
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
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
    completionDate: {
      type: Date,
      required: [true, 'Completion date is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
projectSchema.index({ isFeatured: 1 });
projectSchema.index({ segment: 1 });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

// Define Discriminators
const CivilProject = mongoose.models.CivilProject || Project.discriminator(
  'CivilProject',
  new mongoose.Schema({
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
        message: '{VALUE} is not a valid client type for Civil segment',
      },
      trim: true,
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
          'waterproofing',
          'flooring',
          'landscaping',
          'painting',
          'repairs',
          'rehabilitation',
          'inspection',
          'quality-assurance',
          'boq-estimation',
          'supervision'
        ],
        message: '{VALUE} is not a valid service category for Civil segment',
      },
      trim: true,
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
      required: [true, 'Square footage treated is required for Civil project'],
      min: [0, 'Square footage cannot be negative'],
    },
  })
);

const WebProject = mongoose.models.WebProject || Project.discriminator(
  'WebProject',
  new mongoose.Schema({
    liveUrl: {
      type: String,
      trim: true,
      default: null,
    },
    techStack: {
      type: [String],
      default: [],
    },
  })
);

const FinanceProject = mongoose.models.FinanceProject || Project.discriminator(
  'FinanceProject',
  new mongoose.Schema({
    outcomeMetric: {
      type: String,
      trim: true,
      default: null,
    },
    clientIndustry: {
      type: String,
      trim: true,
      default: null,
    },
  })
);

export { Project as default, CivilProject, WebProject, FinanceProject };
