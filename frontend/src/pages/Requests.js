/**
 * Requests Page
 *
 * View and manage skill exchange requests.
 */

import React, { useState, useEffect } from 'react';
import { getMyRequests, acceptRequest, rejectRequest, deleteRequest } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/cards/RequestCard';
import PageBackground from '../components/common/PageBackground';
import '../assets/Requests.css';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getMyRequests(activeTab);
      setRequests(data);
    } catch (err) {
      setError('Failed to load requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setActionLoading(requestId);
    try {
      await acceptRequest(requestId);
      await fetchRequests(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) {
      return;
    }

    setActionLoading(requestId);
    try {
      await rejectRequest(requestId);
      await fetchRequests(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    setActionLoading(requestId);
    try {
      await deleteRequest(requestId);
      await fetchRequests(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete request');
    } finally {
      setActionLoading(null);
    }
  };

  const getRequestsByStatus = (status) => {
    return requests.filter(request => request.status === status);
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="requests-page animate-fade-in">
      <div className="requests-header">
        <h1>My Requests</h1>
        <p>Manage your skill exchange requests</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({requests.length})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="requests-content">
        {activeTab === 'received' ? (
          <div className="requests-section">
            <h2>Pending Requests</h2>
            {getRequestsByStatus('pending').length === 0 ? (
              <div className="no-requests">
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="requests-grid">
                {getRequestsByStatus('pending').map(request => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    type="received"
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                    actionLoading={actionLoading === request._id}
                  />
                ))}
              </div>
            )}

            <h2>Responded Requests</h2>
            {requests.filter(r => r.status !== 'pending').length === 0 ? (
              <div className="no-requests">
                <p>No responded requests</p>
              </div>
            ) : (
              <div className="requests-grid">
                {requests.filter(r => r.status !== 'pending').map(request => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    type="received"
                    isReadOnly={true}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="requests-section">
            <h2>Sent Requests</h2>
            {requests.length === 0 ? (
              <div className="no-requests">
                <p>You haven't sent any requests yet</p>
              </div>
            ) : (
              <div className="requests-grid">
                {requests.map(request => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    type="sent"
                    onDelete={handleDeleteRequest}
                    actionLoading={actionLoading === request._id}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;