import { validationResult } from 'express-validator';

/**
 * Route middleware to process express-validator checks.
 * Compiles validation faults and returns a structured 400 response if rules fail.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Middleware to pre-populate segment field for updates if client omitted it.
 * Queries the database once using the provided model class.
 */
export const prePopulateSegment = (modelClass) => async (req, res, next) => {
  if (req.params.id && !req.body.segment) {
    try {
      const doc = await modelClass.findById(req.params.id);
      if (doc) {
        req.body.segment = doc.segment;
      }
    } catch (err) {
      // Allow database errors to bubble up or let validator handle it
    }
  }
  next();
};
