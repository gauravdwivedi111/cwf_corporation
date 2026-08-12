import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate access tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

// Helper to generate refresh tokens
const generateRefreshToken = (userId, tokenVersion = 0) => {
  return jwt.sign({ id: userId, version: tokenVersion }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

// Helper for cookie options (httpOnly, secure, sameSite)
const getCookieOptions = () => {
  return {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
};

/**
 * @desc    Authenticate User & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Account is deactivated.',
      });
    }

    // Verify password match
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT access + refresh tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id, user.tokenVersion || 0);

    // Save last login time
    user.lastLogin = new Date();
    await user.save();

    // Set refresh token in httpOnly Cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh expired Access Token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Refresh token is missing.',
    });
  }

  try {
    // Verify refresh token signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Fetch user and make sure account is still active
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User session invalid or account deactivated.',
      });
    }

    // Verify token version match
    if (decoded.version !== user.tokenVersion) {
      // Replay attack / reuse detected! Invalidate all refresh tokens by incrementing version
      user.tokenVersion = (user.tokenVersion || 0) + 1;
      await user.save();
      
      // Clear cookie
      res.clearCookie('refreshToken', getCookieOptions());

      return res.status(401).json({
        success: false,
        message: 'Access denied. Security warning: Refresh token reuse detected.',
      });
    }

    // Rotate refresh token: increment version, save, and issue new access & refresh tokens
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id, user.tokenVersion);

    // Set rotated refresh token in httpOnly Cookie
    res.cookie('refreshToken', newRefreshToken, getCookieOptions());

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired refresh token.',
    });
  }
};

/**
 * @desc    Log user out & clear refresh cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Successfully logged out.',
    });
  } catch (error) {
    next(error);
  }
};
