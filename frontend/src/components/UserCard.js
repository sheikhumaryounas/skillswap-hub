/**
 * UserCard Component
 *
 * Displays user information in a card format.
 * Used in user listing and search pages.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user, onSendRequest, requestLoading, currentUserId }) => {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState('');

  const handleViewProfile = () => {
    navigate(`/users/${user._id}`);
  };

  const handleSendRequest = () => {
    if (!selectedSkill) {
      alert('Please select a skill to request');
      return;
    }
    onSendRequest(user._id, selectedSkill);
  };

  const isCurrentUser = user._id === currentUserId;

  return (
    <div className="card user-card">
      <div className="card-header">
        <h3>{user.name}</h3>
        <div className="user-rating">
          <span className="star">★</span>
          <span>{user.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="card-body">
        <p className="university">{user.university || 'No university specified'}</p>

        {user.bio && (
          <p className="bio">{user.bio}</p>
        )}

        <div className="skills-section">
          <h4>Skills Offered:</h4>
          <div className="skills-list">
            {user.skillsOffered && user.skillsOffered.length > 0 ? (
              user.skillsOffered.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill.title} ({skill.level})
                </span>
              ))
            ) : (
              <span className="no-skills">No skills offered yet</span>
            )}
          </div>
        </div>

        <div className="user-stats">
          <span className="stat">
            <strong>Points:</strong> {user.points}
          </span>
          <span className="stat">
            <strong>Reviews:</strong> {user.totalRatings || 0}
          </span>
        </div>

        {!isCurrentUser && user.skillsOffered && user.skillsOffered.length > 0 && (
          <div className="request-section">
            <h4>Request a Skill:</h4>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="skill-select"
            >
              <option value="">Select a skill...</option>
              {user.skillsOffered.map((skill, index) => (
                <option key={index} value={skill.title}>
                  {skill.title} ({skill.level})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button onClick={handleViewProfile} className="btn btn-secondary">
          View Profile
        </button>
        {!isCurrentUser && user.skillsOffered && user.skillsOffered.length > 0 && (
          <button
            onClick={handleSendRequest}
            className="btn btn-primary"
            disabled={requestLoading || !selectedSkill}
          >
            {requestLoading ? 'Sending...' : 'Send Request'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
