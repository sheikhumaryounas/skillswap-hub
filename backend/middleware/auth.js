/**
 * Authentication Middleware
 * 
 * This middleware protects routes by verifying JWT tokens.
 * It ensures only authenticated users can access protected routes.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes - requires valid JWT token
 * Adds user object to request if token is valid
 */
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token and decode payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database using ID from token
      // Exclude password field from the result
      req.user = await User.findById(decoded.id).select('-password');

      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
