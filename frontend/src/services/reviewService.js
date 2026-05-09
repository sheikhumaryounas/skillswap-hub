/**
 * Review API Service
 * 
 * Functions for creating and viewing reviews.
 */

import api from './api';

/**
 * Create a review for a session
 * @param {Object} reviewData - Review details
 * @returns {Promise} - Created review
 */
export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

/**
 * Get reviews for a specific user
 * @param {String} userId - User ID
 * @returns {Promise} - List of reviews
 */
export const getUserReviews = async (userId) => {
  const response = await api.get(`/reviews/user/${userId}`);
  return response.data;
};

/**
 * Get reviews given by current user
 * @returns {Promise} - List of reviews
 */
export const getMyReviews = async () => {
  const response = await api.get('/reviews/my-reviews');
  return response.data;
};

/**
 * Get reviews for a specific session
 * @param {String} sessionId - Session ID
 * @returns {Promise} - List of reviews
 */
export const getSessionReviews = async (sessionId) => {
  const response = await api.get(`/reviews/session/${sessionId}`);
  return response.data;
};

/**
 * Notification API Service
 * 
 * Functions for managing notifications.
 */

/**
 * Get user's notifications
 * @param {Boolean} unread - Filter for unread only
 * @returns {Promise} - List of notifications
 */
export const getMyNotifications = async (unread = false) => {
  const params = unread ? '?unread=true' : '';
  const response = await api.get(`/notifications${params}`);
  return response.data;
};

/**
 * Mark notification as read
 * @param {String} notificationId - Notification ID
 * @returns {Promise} - Updated notification
 */
export const markAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise} - Success message
 */
export const markAllAsRead = async () => {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
};

/**
 * Delete a notification
 * @param {String} notificationId - Notification ID
 * @returns {Promise} - Success message
 */
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

/**
 * Get count of unread notifications
 * @returns {Promise} - Unread count
 */
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};
