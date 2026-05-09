/**
 * Request Model
 * 
 * This schema manages skill exchange requests between users.
 * A request represents one user asking another to teach them a skill.
 */

const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  // User who sends the request
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User who receives the request
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // The skill being requested
  skillRequested: {
    type: String,
    required: [true, 'Please specify the skill you want to learn'],
    trim: true
  },
  
  // The skill offered in exchange (optional for future barter system)
  skillOffered: {
    type: String,
    trim: true
  },
  
  // Message from sender to receiver
  message: {
    type: String,
    maxlength: [300, 'Message cannot exceed 300 characters'],
    default: ''
  },
  
  // Request status tracking
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  
  // Timestamp of when request was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Timestamp of when request status was updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
requestSchema.index({ sender: 1, receiver: 1 });
requestSchema.index({ status: 1 });

module.exports = mongoose.model('Request', requestSchema);
