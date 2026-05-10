/**
 * Navbar Component
 * 
 * Main navigation bar displayed on all pages.
 * Shows different links based on authentication status.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import { getUnreadCount } from '../../services/reviewService';
import '../../assets/Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, clearUser } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Refresh count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      // Note: This service might need to be verified
      const data = await getUnreadCount();
      setUnreadCount(data?.count || 0);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    clearUser();
    navigate('/login');
  };

  return (
    <nav className="glass">
      <Link to="/" className="logo">
        SkillSwap<span>Hub</span>
      </Link>

      <div className="nav-menu">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/users" className="nav-link">Explore</Link>
            <Link to="/requests" className="nav-link">Requests</Link>
            <Link to="/sessions" className="nav-link">Sessions</Link>
            <Link to="/notifications" className="nav-link nav-icon">
              Notifications
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </Link>
            <div className="nav-user">
              <Link to="/profile" className="profile-link">
                {user?.profilePicture && user.profilePicture !== '/uploads/default-avatar.png' ? (
                  <img 
                    src={`http://localhost:5000${user.profilePicture}`} 
                    alt="Avatar" 
                    className="nav-avatar" 
                  />
                ) : (
                  <div className="avatar-initial-styled" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span>{user?.name || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Join Community</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

