import User from '../models/User.js';
import Inquiry from '../models/Inquiry.js';
import Service from '../models/Service.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

/**
 * @desc    Get administrative dashboard overview stats
 * @route   GET /api/admin/dashboard/stats
 * @access  Private (Admin/Editor)
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Compile lead distribution counts by status
    const statusCounts = await Inquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const leadsByStatus = {
      new: 0,
      contacted: 0,
      'site-visit-scheduled': 0,
      quoted: 0,
      converted: 0,
      closed: 0,
    };

    statusCounts.forEach((item) => {
      if (item._id in leadsByStatus) {
        leadsByStatus[item._id] = item.count;
      }
    });

    // 2. Lead volumes: this week vs last week comparison
    const now = new Date();
    const startOfThisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfLastWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const leadsThisWeek = await Inquiry.countDocuments({
      createdAt: { $gte: startOfThisWeek },
    });

    const leadsLastWeek = await Inquiry.countDocuments({
      createdAt: {
        $gte: startOfLastWeek,
        $lt: startOfThisWeek,
      },
    });

    const growthRate = leadsLastWeek > 0
      ? parseFloat((((leadsThisWeek - leadsLastWeek) / leadsLastWeek) * 100).toFixed(2))
      : 0;

    // 3. Top viewed waterproofing services
    const topServices = await Service.find({})
      .sort({ views: -1 })
      .limit(5)
      .select('title slug category views');

    res.status(200).json({
      success: true,
      data: {
        leadsByStatus,
        leadVolumeComparison: {
          thisWeek: leadsThisWeek,
          lastWeek: leadsLastWeek,
          growthRate,
        },
        topServices,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all staff users
 * @route   GET /api/admin/users
 * @access  Private (Admin/Editor)
 */
export const getStaffUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new staff user
 * @route   POST /api/admin/users
 * @access  Private (Superadmin only)
 */
export const createStaffUser = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user account with this email address already exists.',
      });
    }

    const user = await User.create({
      email,
      password,
      role: role || 'editor',
    });

    res.status(201).json({
      success: true,
      message: 'Staff user created successfully.',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle staff account activation status
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Superadmin only)
 */
export const updateUserStatus = async (req, res, next) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${id}`,
      });
    }

    // Stop superadmins from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Self-deactivation is blocked. You cannot deactivate your own account.',
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Staff account status updated to ${isActive ? 'active' : 'inactive'}.`,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload an image to Cloudinary
 * @route   POST /api/admin/upload
 * @access  Private (Admin/Editor)
 */
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file to upload.',
      });
    }

    const folder = req.body.folder || 'cwf_corporation';
    const imageUrl = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      url: imageUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password for a staff user (Superadmin only)
 * @route   PATCH /api/admin/users/:id/password
 * @access  Private (Superadmin only)
 */
export const resetStaffPassword = async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${id}`,
      });
    }

    user.password = password;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Password reset successfully for user "${user.email}".`,
    });
  } catch (error) {
    next(error);
  }
};
