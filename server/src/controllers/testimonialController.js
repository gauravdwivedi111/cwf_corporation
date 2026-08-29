import Testimonial from '../models/Testimonial.js';

/**
 * @desc    Get all published testimonials
 * @route   GET /api/testimonials
 * @access  Public
 */
export const getTestimonials = async (req, res, next) => {
  try {
    const { segment, all } = req.query;
    const filter = all === 'true' ? {} : { isPublished: true };
    if (segment) {
      filter.segment = segment;
    }
    const testimonials = await Testimonial.find(filter)
      .populate('projectRef', 'title location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new testimonial
 * @route   POST /api/testimonials
 * @access  Private (Admin/Editor)
 */
export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a testimonial
 * @route   PUT /api/testimonials/:id
 * @access  Private (Admin/Editor)
 */
export const updateTestimonial = async (req, res, next) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: `Testimonial not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a testimonial
 * @route   DELETE /api/testimonials/:id
 * @access  Private (Admin/Editor)
 */
export const deleteTestimonial = async (req, res, next) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: `Testimonial not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
