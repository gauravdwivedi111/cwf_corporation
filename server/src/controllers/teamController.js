import TeamMember from '../models/TeamMember.js';

/**
 * @desc    Get all team members
 * @route   GET /api/team
 * @access  Public
 */
export const getTeamMembers = async (req, res, next) => {
  try {
    const { segment } = req.query;
    const filter = {};
    if (segment) {
      filter.segments = segment;
    }
    const teamMembers = await TeamMember.find(filter).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new team member
 * @route   POST /api/team
 * @access  Private (Admin/Editor)
 */
export const createTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMember.create(req.body);
    res.status(201).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a team member
 * @route   PUT /api/team/:id
 * @access  Private (Admin/Editor)
 */
export const updateTeamMember = async (req, res, next) => {
  const { id } = req.params;

  try {
    const teamMember = await TeamMember.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: `Team member not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a team member
 * @route   DELETE /api/team/:id
 * @access  Private (Admin/Editor)
 */
export const deleteTeamMember = async (req, res, next) => {
  const { id } = req.params;

  try {
    const teamMember = await TeamMember.findByIdAndDelete(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: `Team member not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
