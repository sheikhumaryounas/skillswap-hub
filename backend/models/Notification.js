/**
 * Notification Model
 * 
 * This schema manages notifications sent to users about requests,
 * sessions, and other important events.
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // User who receives the notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User who triggered the notification (optional)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Type of notification
  type: {
    type: String,
    enum: [
      'request_received',
      'request_accepted',
      'request_rejected',
      'session_scheduled',
      'session_reminder',
      'session_cancelled',
      'review_received',
      'points_earned'
    ],
    required: true
  },
  
  // Notification message
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Reference to related entity (request, session, etc.)
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['Request', 'Session', 'Review']
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  
  // Whether the notification has been read
  isRead: {
    type: Boolean,
    default: false
  },
  
  // Timestamp of when notification was created
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
