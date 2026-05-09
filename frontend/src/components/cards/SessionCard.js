
/**
 * SessionCard Component
 *
 * Displays session information in a card format.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionCard = ({ session, currentUserId, onComplete, onCancel, actionLoading }) => {
  const navigate = useNavigate();

  const isTeacher = session.teacher._id === currentUserId;
  const role = isTeacher ? 'Teaching' : 'Learning';
  const otherUser = isTeacher ? session.learner : session.teacher;

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'ongoing': return 'status-ongoing';
      default: return 'status-scheduled';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Assuming time is in HH:MM format
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleLeaveReview = () => {
    navigate(`/reviews/create?sessionId=${session._id}`);
  };

  return (
    <div className="card session-card">
      <div className="card-header">
        <h3>{session.skill}</h3>
        <span className={`session-status ${getStatusClass(session.status)}`}>
          {session.status}
        </span>
      </div>

      <div className="card-body">
        <div className="session-details">
          <p><strong>Role:</strong> {role}</p>
          <p><strong>With:</strong> {otherUser.name} ({otherUser.university || 'No university'})</p>
          <p><strong>Date:</strong> {formatDate(session.date)}</p>
          <p><strong>Time:</strong> {formatTime(session.time)}</p>
          <p><strong>Duration:</strong> {session.duration} minutes</p>
          <p><strong>Location:</strong> {session.location}</p>
          {session.notes && (
            <p className="notes">"{session.notes}"</p>
          )}
        </div>
      </div>

      <div className="card-footer">
        {session.status === 'scheduled' && (
          <>
            <button
              onClick={() => onComplete(session._id)}
              className="btn btn-primary"
              disabled={actionLoading}
            >
              {actionLoading ? 'Completing...' : 'Mark Completed'}
            </button>
            <button
              onClick={() => onCancel(session._id)}
              className="btn btn-secondary"
              disabled={actionLoading}
            >
              Cancel
            </button>
          </>
        )}
        {session.status === 'completed' && (
          <button
            onClick={handleLeaveReview}
            className="btn btn-primary"
          >
            Leave Review
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
