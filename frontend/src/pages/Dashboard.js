/**
 * Dashboard Page
 * 
 * Premium User Dashboard for SkillSwap Hub.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyRequests } from '../services/requestService';
import { getMySessions } from '../services/sessionService';
import PageBackground from '../components/common/PageBackground';
import '../assets/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    pendingRequests: 0,
    upcomingSessions: 0,
    activeSwaps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const requests = await getMyRequests('received');
      const pending = requests?.filter(r => r.status === 'pending').length || 0;

      const sessions = await getMySessions('scheduled');
      const upcoming = sessions?.length || 0;

      setStats({
        pendingRequests: pending,
        upcomingSessions: upcoming,
        activeSwaps: (user?.skillsToTeach?.length || 0) + (user?.skillsToLearn?.length || 0),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Syncing your profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, <span>{user?.name || 'Explorer'}</span></h1>
          <p>You have {stats.pendingRequests} new requests waiting for your approval.</p>
        </div>
        <button onClick={() => navigate('/users')} className="btn btn-primary">
          Explore New Skills
        </button>
      </header>

      <div className="stats-row">
        {[
          { label: 'Pending Requests', value: stats.pendingRequests, icon: '📩', color: 'var(--warning)', link: '/requests' },
          { label: 'Upcoming Sessions', value: stats.upcomingSessions, icon: '📅', color: 'var(--primary)', link: '/sessions' },
          { label: 'Active Skills', value: stats.activeSwaps, icon: '🚀', color: 'var(--success)', link: '/profile' },
          { label: 'Reputation Score', value: user?.rating?.toFixed(1) || '5.0', icon: '⭐', color: '#fcd34d', link: '#' }
        ].map((stat, i) => (
          <div key={i} className="card stat-card-v" onClick={() => stat.link !== '#' && navigate(stat.link)}>
            <div className="stat-icon-v" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="card main-actions glass">
          <h2>Quick Actions</h2>
          <div className="actions-list">
            <button className="action-item" onClick={() => navigate('/profile')}>
              <div className="action-icon">👤</div>
              <div className="action-text">
                <strong>Update Profile</strong>
                <span>Keep your skills up to date</span>
              </div>
            </button>
            <button className="action-item" onClick={() => navigate('/sessions')}>
              <div className="action-icon">📅</div>
              <div className="action-text">
                <strong>Manage Sessions</strong>
                <span>View your scheduled swaps</span>
              </div>
            </button>
            <button className="action-item" onClick={() => navigate('/users')}>
              <div className="action-icon">🔍</div>
              <div className="action-text">
                <strong>Browse Community</strong>
                <span>Find mentors and peers</span>
              </div>
            </button>
          </div>
        </section>

        <section className="card profile-snapshot">
          <h2>Profile Snapshot</h2>
          <div className="snapshot-content">
            <div className="skill-group">
              <label>Teaching</label>
              <div className="tag-container">
                {user?.skillsToTeach?.map((s, i) => <span key={i} className="tag teaching">{s}</span>) || 'No skills added'}
              </div>
            </div>
            <div className="skill-group">
              <label>Learning</label>
              <div className="tag-container">
                {user?.skillsToLearn?.map((s, i) => <span key={i} className="tag learning">{s}</span>) || 'No skills added'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

