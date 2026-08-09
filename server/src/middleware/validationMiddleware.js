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
