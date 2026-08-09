import Service from '../models/Service.js';

/**
 * @desc    Get all published services
 * @route   GET /api/services
 * @access  Public
 */
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isPublished: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get service by slug and increment view count
 * @route   GET /api/services/:slug
 * @access  Public
 */
export const getServiceBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    // Find service and increment views field by 1 atomatically
    const service = await Service.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found with slug of: '${slug}'`,
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new service
 * @route   POST /api/services
 * @access  Private (Admin/Editor)
 */
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a service
 * @route   PUT /api/services/:id
 * @access  Private (Admin/Editor)
 */
export const updateService = async (req, res, next) => {
  const { id } = req.params;

  try {
    const service = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a service
 * @route   DELETE /api/services/:id
 * @access  Private (Admin/Editor)
 */
export const deleteService = async (req, res, next) => {
  const { id } = req.params;

  try {
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
