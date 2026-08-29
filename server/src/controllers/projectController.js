import Project, { CivilProject, WebProject, FinanceProject } from '../models/Project.js';
import { validateSegmentPayload } from '../utils/discriminatorValidator.js';

/**
 * @desc    Get all projects (with filtering by category and featured status)
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req, res, next) => {
  try {
    const { category, featured, segment } = req.query;
    const filter = {};

    if (category) {
      filter.serviceCategory = category;
    }

    if (featured !== undefined) {
      filter.isFeatured = featured === 'true';
    }

    if (segment) {
      filter.segment = segment;
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
    const segment = req.body.segment || 'civil';

    // Explicitly validate segment-specific payload and reject mixed fields
    validateSegmentPayload('project', segment, req.body);

    let modelClass;
    if (segment === 'civil') modelClass = CivilProject;
    else if (segment === 'web') modelClass = WebProject;
    else if (segment === 'finance') modelClass = FinanceProject;
    else {
      return res.status(400).json({
        success: false,
        message: `Invalid segment: '${segment}'`
      });
    }

    const project = await modelClass.create(req.body);
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
    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project not found with id: ${id}`,
      });
    }

    const segment = req.body.segment || project.segment;

    // Prevent changing segment of existing project
    if (req.body.segment && req.body.segment !== project.segment) {
      return res.status(400).json({
        success: false,
        message: 'Changing the segment of an existing project is not allowed. Please delete and recreate the project if you wish to change its segment.'
      });
    }

    // Explicitly validate segment-specific payload and reject mixed fields
    validateSegmentPayload('project', segment, req.body);

    project.set(req.body);
    await project.save();

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
