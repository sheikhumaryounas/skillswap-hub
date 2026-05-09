/**
 * Leaderboard Page
 *
 * Display top users by points and ratings.
 */

import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import '../assets/Leaderboard.css';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  const getCurrentUserRank = () => {
    const userIndex = leaderboard.findIndex(u => u._id === user._id);
    return userIndex !== -1 ? userIndex + 1 : null;
  };

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  const currentUserRank = getCurrentUserRank();

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Top skill exchangers on the platform</p>
        {currentUserRank && (
          <div className="user-rank">
            <p>Your current rank: <strong>#{currentUserRank}</strong></p>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="leaderboard-content">
        {leaderboard.length === 0 ? (
          <div className="no-data">
            <p>No leaderboard data available yet</p>
          </div>
        ) : (
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="header-cell rank">Rank</div>
              <div className="header-cell user">User</div>
              <div className="header-cell university">University</div>
              <div className="header-cell points">Points</div>
              <div className="header-cell rating">Rating</div>
              <div className="header-cell reviews">Reviews</div>
            </div>

            {leaderboard.map((userData, index) => (
              <div
                key={userData._id}
                className={`table-row ${userData._id === user._id ? 'current-user' : ''}`}
              >
                <div className="cell rank">
                  <span className="rank-icon">{getRankIcon(index)}</span>
                </div>
                <div className="cell user">
                  <div className="user-info">
                    <span className="user-name">{userData.name}</span>
                    {userData._id === user._id && (
                      <span className="you-badge">You</span>
                    )}
                  </div>
                </div>
                <div className="cell university">
                  {userData.university || 'Not specified'}
                </div>
                <div className="cell points">
                  <span className="points-value">{userData.points}</span>
                </div>
                <div className="cell rating">
                  <span className="rating">
                    ⭐ {userData.rating.toFixed(1)}
                  </span>
                </div>
                <div className="cell reviews">
                  {userData.totalRatings}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="leaderboard-info">
          <h3>How Points Work</h3>
          <div className="points-info">
            <div className="point-item">
              <span className="point-icon">📨</span>
              <span>Send/Receive Request: +5 points</span>
            </div>
            <div className="point-item">
              <span className="point-icon">📅</span>
              <span>Complete Session: +10 points</span>
            </div>
            <div className="point-item">
              <span className="point-icon">⭐</span>
              <span>Receive Review: +2 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;