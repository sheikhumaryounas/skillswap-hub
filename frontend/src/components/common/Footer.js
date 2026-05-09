import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>SkillSwap<span>Hub</span></h2>
            <p>
              The premium peer-to-peer learning platform for university students. 
              Exchange your mastery for new knowledge and grow together.
            </p>
          </div>

          <div className="footer-section">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/users">Explore Skills</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Account</h4>
            <ul>
              <li><Link to="/profile">Profile Settings</Link></li>
              <li><Link to="/requests">My Requests</Link></li>
              <li><Link to="/sessions">Scheduled Sessions</Link></li>
              <li><Link to="/notifications">Notifications</Link></li>
            </ul>
          </div>

          <div className="footer-section footer-newsletter">
            <h4>Stay Connected</h4>
            <p>Join our newsletter for latest updates and skills tips.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="your@email.com" />
              <button className="btn btn-primary btn-small">Join</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SkillSwap Hub. All rights reserved.</p>
          <div className="social-links">
            <a href="#" className="social-icon">Li</a>
            <a href="#" className="social-icon">Tw</a>
            <a href="#" className="social-icon">Ig</a>
            <a href="#" className="social-icon">Gh</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
