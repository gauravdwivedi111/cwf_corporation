import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes. Verifies the JWT access token in the Authorization header.
 * Attaches the user object to req.user if verification succeeds.
 */
export const protect = async (req, res, next) => {
  let token;

  // Read Bearer token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authorization token is missing.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and verify account is active
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user session is invalid. User not found.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. This account has been deactivated.',
      });
    }

    // Attach user to request context
    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Access denied. The token is invalid or has expired.',
    });
  }
};

/**
 * Middleware to authorize specific user roles.
 * Must be mounted after the protect middleware.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};
