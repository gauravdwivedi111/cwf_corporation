import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    photo: {
      type: String,
      required: [true, 'Photo URL is required'],
    },
    bio: {
      type: String,
      trim: true,
    },
    segments: {
      type: [String],
      default: ['civil'],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
teamMemberSchema.index({ order: 1 });

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);
export default TeamMember;
