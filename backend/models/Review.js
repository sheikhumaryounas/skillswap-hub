/**
 * Review Model
 * 
 * This schema stores ratings and feedback given after a session.
 * Reviews help build user reputation and improve the matching system.
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Reference to the session being reviewed
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  
  // User who gives the review
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User who receives the review
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Rating given (1 to 5 stars)
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // Written feedback/comment
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    trim: true
  },
  
  // Tags to categorize the review
  tags: [{
    type: String,
    enum: ['helpful', 'knowledgeable', 'patient', 'punctual', 'clear', 'prepared']
  }],
  
  // Timestamp of when review was created
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one review per reviewer per session
reviewSchema.index({ session: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
