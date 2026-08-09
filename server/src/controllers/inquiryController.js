import Inquiry from '../models/Inquiry.js';
import { sendAdminInquiryNotification, sendCustomerAcknowledge } from '../utils/emailService.js';

/**
 * @desc    Submit a new lead inquiry
 * @route   POST /api/inquiries
 * @access  Public (Rate-limited, Validated)
 */
export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    // Trigger emails asynchronously in the background so API responds instantly
    sendAdminInquiryNotification(inquiry);
    sendCustomerAcknowledge(inquiry);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leads list with pagination, search, status & date filtering
 * @route   GET /api/admin/inquiries
 * @access  Private (Admin/Editor)
 */
export const getInquiries = async (req, res, next) => {
  const { status, startDate, endDate, search, page = 1, limit = 10 } = req.query;
  const filter = {};

  // Status Filter
  if (status) {
    filter.status = status;
  }

  // Date Range Filter
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  // Search filter matching name, phone, email, and description message
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
      { message: searchRegex },
    ];
  }

  // Parse pagination details
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skipNum = (pageNum - 1) * limitNum;

  try {
    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .populate('assignedTo', 'email role')
      .populate('internalNotes.addedBy', 'email role')
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lead status & add internal notes
 * @route   PATCH /api/admin/inquiries/:id/status
 * @access  Private (Admin/Editor)
 */
export const updateInquiryStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status, note, assignedTo } = req.body;

  try {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: `Inquiry not found with id: ${id}`,
      });
    }

    // Update status if present in body
    if (status) {
      inquiry.status = status;
    }

    // Update staff assignment if present in body
    if (assignedTo !== undefined) {
      inquiry.assignedTo = assignedTo; // supports null to unassign
    }

    // Add internal note if present in body
    if (note) {
      inquiry.internalNotes.push({
        note,
        addedBy: req.user._id,
      });
    }

    await inquiry.save();

    // Populate user information for clean API response
    await inquiry.populate([
      { path: 'assignedTo', select: 'email role' },
      { path: 'internalNotes.addedBy', select: 'email role' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Inquiry details updated successfully.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};
