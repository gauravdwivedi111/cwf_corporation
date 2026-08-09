import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    companyPhone: {
      type: String,
      required: [true, 'Company phone is required'],
      trim: true,
    },
    companyEmail: {
      type: String,
      required: [true, 'Company email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    address: {
      street: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, required: [true, 'State is required'] },
      pincode: { type: String, required: [true, 'Pincode is required'] },
      country: { type: String, required: [true, 'Country is required'], default: 'India' },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    businessHours: {
      type: String,
      required: [true, 'Business hours are required'],
      trim: true,
    },
    aboutText: {
      type: String,
      required: [true, 'About text is required'],
      trim: true,
    },
    certifications: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to enforce singleton behavior
siteSettingsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({});
    if (count > 0) {
      return next(new Error('SiteSettings is a singleton. Only one document can exist.'));
    }
  }
  next();
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
