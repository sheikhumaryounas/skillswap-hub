
/**
 * RequestCard Component
 *
 * Displays request information in a card format.
 */

import React from 'react';
import '../../assets/Requests.css';

const RequestCard = ({ request, type, onAccept, onReject, onDelete, actionLoading, isReadOnly }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card request-card">
      <div className="card-header">
        <h3>
          {type === 'received' ? request.sender.name : request.receiver.name}
        </h3>
        <span className={`request-status ${getStatusClass(request.status)}`}>
          {request.status}
        </span>
      </div>

      <div className="card-body">
        <div className="request-details">
          <p><strong>Skill Requested:</strong> {request.skillRequested}</p>
          {request.skillOffered && (
            <p><strong>Skill Offered:</strong> {request.skillOffered}</p>
          )}
          {request.message && (
            <p className="message">"{request.message}"</p>
          )}
          <p className="request-date">
            {type === 'received' ? 'Received' : 'Sent'} on {formatDate(request.createdAt)}
          </p>
        </div>

        <div className="user-info">
          <div className="user-detail">
            <strong>University:</strong> {type === 'received' ? request.sender.university : request.receiver.university || 'Not specified'}
          </div>
          <div className="user-detail">
            <strong>Rating:</strong> ⭐ {type === 'received' ? request.sender.rating.toFixed(1) : request.receiver.rating.toFixed(1)}
          </div>
        </div>
      </div>

      {!isReadOnly && (
        <div className="card-footer">
          {type === 'received' && request.status === 'pending' && (
            <>
              <button
                onClick={() => onAccept(request._id)}
                className="btn btn-primary"
                disabled={actionLoading}
              >
                {actionLoading ? 'Accepting...' : 'Accept'}
              </button>
              <button
                onClick={() => onReject(request._id)}
                className="btn btn-secondary"
                disabled={actionLoading}
              >
                Reject
              </button>
            </>
          )}
          {type === 'sent' && request.status === 'pending' && (
            <button
              onClick={() => onDelete(request._id)}
              className="btn btn-secondary"
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Cancel'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestCard;
