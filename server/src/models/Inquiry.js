import mongoose from 'mongoose';

const internalNoteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: [true, 'Note text is required'],
    trim: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Note author is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
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
    segmentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    propertyType: {
      type: String,
      enum: {
        values: ['residential', 'commercial', 'industrial', 'other'],
        message: '{VALUE} is not a valid property type',
      },
      default: 'residential',
    },
    serviceInterested: {
      type: String,
      enum: {
        values: [
          'terrace',
          'basement',
          'bathroom',
          'tank',
          'facade',
          'injection-grouting',
          'other',
        ],
        message: '{VALUE} is not a valid service',
      },
    },
    message: {
      type: String,
      required: [true, 'Inquiry message is required'],
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Lead source is required'],
      enum: {
        values: ['website-form', 'phone', 'referral', 'social-media', 'other'],
        message: '{VALUE} is not a valid source',
      },
      default: 'website-form',
    },
    status: {
      type: String,
      enum: {
        values: [
          'new',
          'contacted',
          'site-visit-scheduled',
          'quoted',
          'converted',
          'closed',
        ],
        message: '{VALUE} is not a valid status',
      },
      default: 'new',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    internalNotes: [internalNoteSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ assignedTo: 1 });
inquirySchema.index({ segment: 1 });

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
