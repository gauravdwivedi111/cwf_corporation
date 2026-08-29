import Service, { CivilService, WebService, FinanceService } from '../models/Service.js';
import sanitizeHtml from 'sanitize-html';
import { validateSegmentPayload } from '../utils/discriminatorValidator.js';

/**
 * @desc    Get all published services
 * @route   GET /api/services
 * @access  Public
 */
export const getServices = async (req, res, next) => {
  try {
    const { segment, all } = req.query;
    const filter = all === 'true' ? {} : { isPublished: true };
    if (segment) {
      filter.segment = segment;
    }
    const services = await Service.find(filter).sort({ order: 1 });
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
    const segment = req.body.segment || 'civil';
    
    // Explicitly validate segment-specific payload and reject mixed fields
    validateSegmentPayload('service', segment, req.body);

    let modelClass;
    if (segment === 'civil') modelClass = CivilService;
    else if (segment === 'web') modelClass = WebService;
    else if (segment === 'finance') modelClass = FinanceService;
    else {
      return res.status(400).json({
        success: false,
        message: `Invalid segment: '${segment}'`
      });
    }

    // Sanitize rich-text content input to block stored XSS
    if (req.body.fullDescription) {
      req.body.fullDescription = sanitizeHtml(req.body.fullDescription, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': ['src', 'alt'],
          'a': ['href', 'target', 'rel']
        }
      });
    }
    const service = await modelClass.create(req.body);
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
    let service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found with id: ${id}`,
      });
    }

    const segment = req.body.segment || service.segment;

    // Prevent changing segment of existing service
    if (req.body.segment && req.body.segment !== service.segment) {
      return res.status(400).json({
        success: false,
        message: 'Changing the segment of an existing service is not allowed. Please delete and recreate the service if you wish to change its segment.'
      });
    }

    // Explicitly validate segment-specific payload and reject mixed fields
    validateSegmentPayload('service', segment, req.body);

    // Sanitize rich-text content input to block stored XSS
    if (req.body.fullDescription) {
      req.body.fullDescription = sanitizeHtml(req.body.fullDescription, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': ['src', 'alt'],
          'a': ['href', 'target', 'rel']
        }
      });
    }

    service.set(req.body);
    await service.save();

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
