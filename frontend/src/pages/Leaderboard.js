/**
 * Leaderboard Page
 *
 * Display top users by points and ratings with a premium competitive feel.
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

  const getCurrentUserRank = () => {
    const userIndex = leaderboard.findIndex(u => u._id === user._id);
    return userIndex !== -1 ? userIndex + 1 : null;
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  const currentUserRank = getCurrentUserRank();
  const topThree = leaderboard.slice(0, 3);
  const theRest = leaderboard.slice(3);

  return (
    <div className="leaderboard-page animate-fade-in">
      <div className="leaderboard-header">
        <h1>🏆 <span>Elite</span> Champions</h1>
        <p>The top skill exchangers dominating the community</p>
        
        {currentUserRank && (
          <div className="user-rank-pill">
            Your Current Rank: <span>#{currentUserRank}</span>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="leaderboard-content">
        {leaderboard.length === 0 ? (
          <div className="no-data card glass">
            <p>The championship has not begun yet. Be the first to earn points!</p>
          </div>
        ) : (
          <>
            {/* Podium Section */}
            <div className="podium-section">
              {topThree[1] && (
                <div className="podium-item second">
                  <div className="podium-rank">2</div>
                  <div className="avatar-placeholder">{topThree[1].name.charAt(0)}</div>
                  <div className="podium-info">
                    <h3>{topThree[1].name}</h3>
                    <p>{topThree[1].points} pts</p>
                  </div>
                </div>
              )}
              
              {topThree[0] && (
                <div className="podium-item first">
                  <div className="crown">👑</div>
                  <div className="podium-rank">1</div>
                  <div className="avatar-placeholder">{topThree[0].name.charAt(0)}</div>
                  <div className="podium-info">
                    <h3>{topThree[0].name}</h3>
                    <p>{topThree[0].points} pts</p>
                  </div>
                </div>
              )}

              {topThree[2] && (
                <div className="podium-item third">
                  <div className="podium-rank">3</div>
                  <div className="avatar-placeholder">{topThree[2].name.charAt(0)}</div>
                  <div className="podium-info">
                    <h3>{topThree[2].name}</h3>
                    <p>{topThree[2].points} pts</p>
                  </div>
                </div>
              )}
            </div>

            {/* List Section */}
            <div className="leaderboard-list card glass">
              <div className="list-header">
                <span>Rank</span>
                <span>User</span>
                <span>University</span>
                <span className="text-right">Score</span>
              </div>
              
              {theRest.map((userData, index) => (
                <div 
                  key={userData._id} 
                  className={`list-row ${userData._id === user._id ? 'highlight-me' : ''}`}
                >
                  <div className="rank-num">#{index + 4}</div>
                  <div className="user-name-cell">
                    <strong>{userData.name}</strong>
                    {userData._id === user._id && <span className="you-label">YOU</span>}
                  </div>
                  <div className="uni-cell">{userData.university || 'N/A'}</div>
                  <div className="score-cell">{userData.points}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="scoring-rules card glass">
          <h3>🎖️ Honor Rules</h3>
          <div className="rules-grid">
            <div className="rule-box">
              <strong>+10</strong>
              <span>Session Done</span>
            </div>
            <div className="rule-box">
              <strong>+5</strong>
              <span>New Request</span>
            </div>
            <div className="rule-box">
              <strong>+2</strong>
              <span>Good Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;