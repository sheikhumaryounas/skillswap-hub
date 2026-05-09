/**
 * Notification Controller
 * 
 * Handles fetching and managing user notifications.
 */

const Notification = require('../models/Notification');

/**
 * Get all notifications for current user
 * Route: GET /api/notifications
 * Access: Private
 */
const getMyNotifications = async (req, res) => {
  try {
    const { unread } = req.query;

    // Build query
    let query = { recipient: req.user._id };

    // Filter by read status if specified
    if (unread === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name university')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 notifications

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark a notification as read
 * Route: PUT /api/notifications/:id/read
 * Access: Private
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Verify notification belongs to current user
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark all notifications as read
 * Route: PUT /api/notifications/mark-all-read
 * Access: Private
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a notification
 * Route: DELETE /api/notifications/:id
 * Access: Private
 */
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Verify notification belongs to current user
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get count of unread notifications
 * Route: GET /api/notifications/unread-count
 * Access: Private
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};
