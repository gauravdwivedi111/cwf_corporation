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
    segment: {
      type: String,
      required: [true, 'Segment is required'],
      enum: {
        values: ['civil', 'web', 'finance'],
        message: '{VALUE} is not a valid segment',
      },
      default: 'civil',
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      trim: true,
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
serviceSchema.index({ segment: 1 });
serviceSchema.index({ isPublished: 1, order: 1 });

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

// Define Discriminators
const CivilService = mongoose.models.CivilService || Service.discriminator(
  'CivilService',
  new mongoose.Schema({
    category: {
      type: String,
      required: [true, 'Service category is required for Civil segment'],
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
        message: '{VALUE} is not a valid category for Civil segment',
      },
      trim: true,
    },
    warrantyYears: {
      type: Number,
      default: 0,
    },
  })
);

const WebService = mongoose.models.WebService || Service.discriminator(
  'WebService',
  new mongoose.Schema({
    category: {
      type: String,
      required: [true, 'Service category is required for Web segment'],
      enum: {
        values: [
          'e-commerce', 'corporate-site', 'web-app', 'seo-maintenance', 'custom-development',
          'website-development', 'business-portals', 'ecommerce-solutions', 'mobile-apps',
          'digital-branding', 'digital-marketing', 'crm-automation', 'online-solutions'
        ],
        message: '{VALUE} is not a valid category for Web segment',
      },
      trim: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    projectTimeline: {
      type: String,
      trim: true,
    },
    pricingModel: {
      type: String,
      required: [true, 'Pricing model is required for Web segment'],
      enum: {
        values: ['fixed', 'hourly', 'retainer'],
        message: '{VALUE} is not a valid pricing model',
      },
    },
  })
);

const FinanceService = mongoose.models.FinanceService || Service.discriminator(
  'FinanceService',
  new mongoose.Schema({
    category: {
      type: String,
      required: [true, 'Service category is required for Finance segment'],
      enum: {
        values: [
          'business-loan', 'personal-loan', 'investment-advisory', 'tax-consultancy', 'working-capital',
          'investment-planning', 'insurance-solutions', 'loan-assistance', 'nri-corner',
          'behavioural-profiling', 'risk-profiling', 'financial-planning', 'wealth-guidance'
        ],
        message: '{VALUE} is not a valid category for Finance segment',
      },
      trim: true,
    },
    loanRangeMin: {
      type: Number,
      default: null,
    },
    loanRangeMax: {
      type: Number,
      default: null,
    },
    interestRateInfo: {
      type: String,
      trim: true,
      default: null,
    },
    eligibilityNotes: {
      type: String,
      trim: true,
      default: null,
    },
  })
);

export { Service as default, CivilService, WebService, FinanceService };
