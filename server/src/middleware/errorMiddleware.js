import logger from '../utils/logger.js';

/**
 * Centralized global error handling middleware.
 * Formats Mongoose and general Javascript exceptions.
 * Masks runtime stack traces in production environment to avoid info leaks.
 */
export const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Handle Mongoose CastError (invalid ObjectIds)
  if (err.name === 'CastError') {
    const message = `Resource not found with identifier: ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Handle Mongoose duplicate key errors (uniqueness constraint failures)
  if (err.code === 11000) {
    const message = 'Duplicate key error: Field value already exists.';
    error = new Error(message);
    error.statusCode = 400;
  }

  // Handle Mongoose Schema validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }

  const statusCode = error.statusCode || err.statusCode || 500;

  // Server-side Winston logging based on status codes
  if (statusCode === 500) {
    logger.error(`[500] ${req.method} ${req.originalUrl} - ${err.message}`, {
      stack: err.stack,
      ip: req.ip,
      body: req.method !== 'GET' ? req.body : null,
    });
  } else {
    logger.warn(`[${statusCode}] ${req.method} ${req.originalUrl} - ${err.message}`);
  }

  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
  };

  // Attach stack trace only if not in production environment
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
