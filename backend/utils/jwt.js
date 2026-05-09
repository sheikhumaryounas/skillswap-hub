/**
 * JWT Utilities
 * 
 * This file contains helper functions for generating and verifying
 * JSON Web Tokens used for user authentication.
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a user
 * @param {String} userId - The user's MongoDB ID
 * @returns {String} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload containing user ID
    process.env.JWT_SECRET, // Secret key from environment
    { expiresIn: '30d' } // Token expires in 30 days
  );
};

/**
 * Verify JWT token
 * @param {String} token - The JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { generateToken, verifyToken };
