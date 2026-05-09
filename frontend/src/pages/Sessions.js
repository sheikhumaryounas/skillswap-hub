/**
 * Sessions Page
 *
 * View and manage learning sessions.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySessions, completeSession, cancelSession, createSession } from '../services/sessionService';
import { useAuth } from '../context/AuthContext';
import SessionCard from '../components/cards/SessionCard';
import '../assets/Sessions.css';

const Sessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getMySessions();
      setSessions(data);
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async (sessionId) => {
    if (!window.confirm('Mark this session as completed? This will allow you to leave a review.')) {
      return;
    }

    setActionLoading(sessionId);
    try {
      await completeSession(sessionId);
      await fetchSessions(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete session');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) {
      return;
    }

    setActionLoading(sessionId);
    try {
      await cancelSession(sessionId);
      await fetchSessions(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel session');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateSession = () => {
    navigate('/requests'); // Redirect to requests to create sessions from accepted requests
  };

  const filterSessions = () => {
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return sessions.filter(session =>
          session.status === 'scheduled' && new Date(session.date) > now
        );
      case 'completed':
        return sessions.filter(session => session.status === 'completed');
      case 'cancelled':
        return sessions.filter(session => session.status === 'cancelled');
      default:
        return sessions;
    }
  };

  const getTabCount = (tab) => {
    const now = new Date();

    switch (tab) {
      case 'upcoming':
        return sessions.filter(session =>
          session.status === 'scheduled' && new Date(session.date) > now
        ).length;
      case 'completed':
        return sessions.filter(session => session.status === 'completed').length;
      case 'cancelled':
        return sessions.filter(session => session.status === 'cancelled').length;
      default:
        return sessions.length;
    }
  };

  if (loading) {
    return <div className="loading">Loading sessions...</div>;
  }

  const filteredSessions = filterSessions();

  return (
    <div className="sessions-page">
      <div className="sessions-header">
        <h1>My Sessions</h1>
        <p>Manage your learning sessions</p>
        <button onClick={handleCreateSession} className="btn btn-primary create-session-btn">
          Schedule New Session
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({getTabCount('all')})
        </button>
        <button
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({getTabCount('upcoming')})
        </button>
        <button
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({getTabCount('completed')})
        </button>
        <button
          className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled ({getTabCount('cancelled')})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="sessions-content">
        {filteredSessions.length === 0 ? (
          <div className="no-sessions">
            <p>
              {activeTab === 'all'
                ? "You don't have any sessions yet. Accept a request to get started!"
                : `No ${activeTab} sessions found.`
              }
            </p>
          </div>
        ) : (
          <div className="sessions-grid">
            {filteredSessions.map(session => (
              <SessionCard
                key={session._id}
                session={session}
                currentUserId={user._id}
                onComplete={handleCompleteSession}
                onCancel={handleCancelSession}
                actionLoading={actionLoading === session._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;