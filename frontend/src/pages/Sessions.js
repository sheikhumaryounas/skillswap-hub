/**
 * Sessions Page
 *
 * View and manage learning sessions.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySessions, completeSession, cancelSession, createSession } from '../services/sessionService';
import { getMyRequests } from '../services/requestService';
import { createReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import SessionCard from '../components/cards/SessionCard';
import PageBackground from '../components/common/PageBackground';
import Modal from '../components/common/Modal';
import '../assets/Sessions.css';

const Sessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    requestId: '',
    date: '',
    time: '',
    duration: 60,
    location: 'Google Meet / Zoom'
  });
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' // 'success' or 'error'
  });

  useEffect(() => {
    fetchSessions();
    fetchAcceptedRequests();
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

  const fetchAcceptedRequests = async () => {
    try {
      const data = await getMyRequests('received');
      const accepted = data.filter(r => r.status === 'accepted');
      setAcceptedRequests(accepted);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleCompleteSession = async (sessionId) => {
    if (!window.confirm('Mark this session as completed?')) return;
    setActionLoading(sessionId);
    try {
      await completeSession(sessionId);
      await fetchSessions();
      setAlertModal({
        isOpen: true,
        title: 'Session Completed',
        message: 'Great job! The session has been marked as completed.',
        type: 'success'
      });
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Action Failed',
        message: err.response?.data?.message || 'Failed to complete session',
        type: 'error'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel?')) return;
    setActionLoading(sessionId);
    try {
      await cancelSession(sessionId);
      await fetchSessions();
      setAlertModal({
        isOpen: true,
        title: 'Session Cancelled',
        message: 'The session has been successfully cancelled.',
        type: 'success'
      });
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Action Failed',
        message: err.response?.data?.message || 'Failed to cancel session',
        type: 'error'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateSessionSubmit = async (e) => {
    e.preventDefault();
    
    if (!newSession.requestId) {
      alert('Please select an accepted request to schedule a session.');
      return;
    }

    setActionLoading('creating');
    try {
      await createSession(newSession);
      setIsModalOpen(false);
      setNewSession({ requestId: '', date: '', time: '', duration: 60, location: 'Google Meet / Zoom' });
      await fetchSessions();
      setAlertModal({
        isOpen: true,
        title: 'Session Scheduled',
        message: 'Your knowledge swap has been successfully scheduled!',
        type: 'success'
      });
    } catch (err) {
      setAlertModal({
        isOpen: true,
        title: 'Scheduling Failed',
        message: err.response?.data?.message || 'Failed to schedule session',
        type: 'error'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveReviewClick = (session) => {
    setSelectedSessionForReview(session);
    setReviewRating(5);
    setReviewComment('');
    setReviewError('');
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setActionLoading('reviewing');

    try {
      const isTeacher = selectedSessionForReview.teacher._id === user._id;
      const targetUserId = isTeacher ? selectedSessionForReview.learner._id : selectedSessionForReview.teacher._id;

      await createReview({
        sessionId: selectedSessionForReview._id,
        revieweeId: targetUserId,
        rating: reviewRating,
        comment: reviewComment
      });

      setIsReviewModalOpen(false);
      setAlertModal({
        isOpen: true,
        title: 'Review Submitted',
        message: 'Thank you! Your feedback helps keep the community great.',
        type: 'success'
      });
      await fetchSessions();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setActionLoading(null);
    }
  };

  const filterSessions = () => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming': return sessions.filter(s => s.status === 'scheduled' && new Date(s.date) > now);
      case 'completed': return sessions.filter(s => s.status === 'completed');
      case 'cancelled': return sessions.filter(s => s.status === 'cancelled');
      default: return sessions;
    }
  };

  const getTabCount = (tab) => {
    const now = new Date();
    switch (tab) {
      case 'upcoming': return sessions.filter(s => s.status === 'scheduled' && new Date(s.date) > now).length;
      case 'completed': return sessions.filter(s => s.status === 'completed').length;
      case 'cancelled': return sessions.filter(s => s.status === 'cancelled').length;
      default: return sessions.length;
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  const filteredSessions = filterSessions();

  return (
    <div className="sessions-page animate-fade-in">
      <div className="sessions-header">
        <div>
          <h1>My <span>Sessions</span></h1>
          <p>You have {getTabCount('upcoming')} upcoming knowledge swaps.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          Schedule New Session
        </button>
      </div>

      <div className="tabs glass">
        {['all', 'upcoming', 'completed', 'cancelled'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getTabCount(tab)})
          </button>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="sessions-content">
        {filteredSessions.length === 0 ? (
          <div className="no-sessions card glass">
            <p>No {activeTab !== 'all' ? activeTab : ''} sessions found.</p>
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
                onLeaveReview={handleLeaveReviewClick}
                actionLoading={actionLoading === session._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scheduling Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          {/* ... existing scheduling modal ... */}
          <div className="card modal-content glass">
            <h2>Schedule Knowledge Swap</h2>
            <form onSubmit={handleCreateSessionSubmit}>
              <div className="input-group">
                <label>Select Accepted Request</label>
                {acceptedRequests.length === 0 ? (
                  <p className="hint-text">You don't have any accepted requests to schedule. Please accept a request from the "Requests" page first.</p>
                ) : (
                  <select 
                    value={newSession.requestId}
                    onChange={(e) => setNewSession({...newSession, requestId: e.target.value})}
                    required
                  >
                    <option value="">-- Choose a request --</option>
                    {acceptedRequests.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.sender.name} wants to learn {r.skillRequested}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={newSession.date} 
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Time</label>
                  <input 
                    type="time" 
                    value={newSession.time} 
                    onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Location / Link</label>
                <input 
                  type="text" 
                  value={newSession.location} 
                  onChange={(e) => setNewSession({...newSession, location: e.target.value})}
                  placeholder="e.g. Google Meet Link"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={actionLoading === 'creating' || acceptedRequests.length === 0}
                >
                  {actionLoading === 'creating' ? 'Scheduling...' : 'Confirm Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => actionLoading !== 'reviewing' && setIsReviewModalOpen(false)}
        title={`Review your session with ${selectedSessionForReview?.teacher._id === user._id ? selectedSessionForReview?.learner.name : selectedSessionForReview?.teacher.name}`}
        actions={
          <>
            <button className="btn btn-outline" onClick={() => setIsReviewModalOpen(false)} disabled={actionLoading === 'reviewing'}>Cancel</button>
            <button className="btn btn-primary" onClick={handleReviewSubmit} disabled={actionLoading === 'reviewing'}>
              {actionLoading === 'reviewing' ? 'Submitting...' : 'Submit Review'}
            </button>
          </>
        }
      >
        <div className="review-form">
          <p>How was your experience learning/teaching <strong>{selectedSessionForReview?.skill}</strong>?</p>
          
          <div className="input-group">
            <label>Rating (1-5 stars)</label>
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button"
                  className={`star-btn ${reviewRating >= star ? 'active' : ''}`}
                  onClick={() => setReviewRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Comments</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your thoughts on the session..."
              rows="4"
              required
            ></textarea>
          </div>
          {reviewError && <div className="error-message">{reviewError}</div>}
        </div>
      </Modal>

      {/* Alert Modal */}
      <Modal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        actions={
          <button className="btn btn-primary" onClick={() => setAlertModal({ ...alertModal, isOpen: false })}>
            Got it
          </button>
        }
      >
        <div className={`alert-content ${alertModal.type}`}>
          <div className="alert-icon">
            {alertModal.type === 'success' ? '✅' : '❌'}
          </div>
          <p>{alertModal.message}</p>
        </div>
      </Modal>
    </div>
  );
};

export default Sessions;