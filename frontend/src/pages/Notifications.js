/**
 * Notifications Page
 *
 * View and manage user notifications.
 */

import React, { useState, useEffect } from 'react';
import { getMyNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import '../assets/Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [showUnreadOnly]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications(showUnreadOnly);
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    setActionLoading(notificationId);
    try {
      await markAsRead(notificationId);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err) {
      alert('Failed to mark notification as read');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      alert('No unread notifications to mark');
      return;
    }

    try {
      await markAllAsRead();
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err) {
      alert('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    setActionLoading(notificationId);
    try {
      await deleteNotification(notificationId);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err) {
      alert('Failed to delete notification');
    } finally {
      setActionLoading(null);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'request_received':
        return '📨';
      case 'request_accepted':
        return '✅';
      case 'request_rejected':
        return '❌';
      case 'session_scheduled':
        return '📅';
      case 'session_reminder':
        return '⏰';
      case 'session_cancelled':
        return '🚫';
      case 'review_received':
        return '⭐';
      case 'points_earned':
        return '🏆';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <p>Stay updated with your skill exchange activities</p>
        <div className="notification-stats">
          <span className="unread-count">
            {unreadCount} unread
          </span>
          <button
            onClick={handleMarkAllAsRead}
            className="btn btn-secondary"
            disabled={unreadCount === 0}
          >
            Mark All Read
          </button>
        </div>
      </div>

      <div className="filter-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
          />
          Show unread only
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="notifications-content">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>
              {showUnreadOnly
                ? 'No unread notifications'
                : 'No notifications yet'
              }
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map(notification => (
              <div
                key={notification._id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <p className="notification-message">
                    {notification.message}
                  </p>
                  <span className="notification-date">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="btn btn-small btn-primary"
                      disabled={actionLoading === notification._id}
                    >
                      {actionLoading === notification._id ? '...' : 'Mark Read'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification._id)}
                    className="btn btn-small btn-secondary"
                    disabled={actionLoading === notification._id}
                  >
                    {actionLoading === notification._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;