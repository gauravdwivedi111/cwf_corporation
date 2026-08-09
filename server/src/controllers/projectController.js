import Project from '../models/Project.js';

/**
 * @desc    Get all projects (with filtering by category and featured status)
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) {
      filter.serviceCategory = category;
    }

    if (featured !== undefined) {
      filter.isFeatured = featured === 'true';
    }

    const projects = await Project.find(filter).sort({ completionDate: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin/Editor)
 */
export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin/Editor)
 */
export const updateProject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin/Editor)
 */
export const deleteProject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
