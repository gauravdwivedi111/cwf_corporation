import mongoose from 'mongoose';

const segmentInfoSchema = new mongoose.Schema(
  {
    segment: {
      type: String,
      required: [true, 'Segment is required'],
      enum: {
        values: ['civil', 'web', 'finance'],
        message: '{VALUE} is not a valid segment',
      },
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    heroDescription: {
      type: String,
      required: [true, 'Hero description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Icon identifier is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'Display order is required'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SegmentInfo = mongoose.models.SegmentInfo || mongoose.model('SegmentInfo', segmentInfoSchema);
export default SegmentInfo;
