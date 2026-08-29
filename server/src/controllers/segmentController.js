import SegmentInfo from '../models/SegmentInfo.js';

/**
 * @desc    Get all SegmentInfo records
 * @route   GET /api/segments
 * @access  Public
 */
export const getSegments = async (req, res, next) => {
  try {
    const segments = await SegmentInfo.find({}).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: segments.length,
      data: segments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single segment's landing content
 * @route   GET /api/segments/:segment
 * @access  Public
 */
export const getSegmentByCode = async (req, res, next) => {
  const { segment } = req.params;
  try {
    const info = await SegmentInfo.findOne({ segment: segment.toLowerCase() });
    if (!info) {
      return res.status(404).json({
        success: false,
        message: `Segment '${segment}' not found.`,
      });
    }
    res.status(200).json({
      success: true,
      data: info,
    });
  } catch (error) {
    next(error);
  }
};
