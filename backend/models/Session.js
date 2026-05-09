/**
 * Session Model
 * 
 * This schema manages scheduled learning sessions between users.
 * Sessions are created after a request is accepted.
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // Reference to the request that led to this session
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  
  // User who teaches (usually the receiver of the request)
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User who learns (usually the sender of the request)
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Skill being taught in this session
  skill: {
    type: String,
    required: true,
    trim: true
  },
  
  // Scheduled date for the session
  date: {
    type: Date,
    required: [true, 'Please provide a session date']
  },
  
  // Scheduled time for the session (stored as string for simplicity)
  time: {
    type: String,
    required: [true, 'Please provide a session time']
  },
  
  // Duration of the session in minutes
  duration: {
    type: Number,
    default: 60,
    min: 30,
    max: 180
  },
  
  // Location or meeting link for the session
  location: {
    type: String,
    default: 'To be decided'
  },
  
  // Status of the session
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'ongoing'],
    default: 'scheduled'
  },
  
  // Notes for the session
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  
  // Timestamp tracking
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
sessionSchema.index({ teacher: 1, learner: 1 });
sessionSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Session', sessionSchema);
