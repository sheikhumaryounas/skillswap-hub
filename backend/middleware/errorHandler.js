/**
 * Error Handling Middleware
 * 
 * This middleware handles errors throughout the application
 * and sends consistent error responses to the client.
 */

/**
 * Custom error handler middleware
 * Catches all errors and formats them into consistent JSON responses
 */
const errorHandler = (err, req, res, next) => {
  // Default status code is 500 (Internal Server Error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists. Please use a different ${field}.`;
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Send error response
  res.status(statusCode).json({
    message,
    // Include stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Middleware for handling 404 (Not Found) errors
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
