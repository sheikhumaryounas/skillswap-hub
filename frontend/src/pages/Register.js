/**
 * Register Page
 * 
 * User registration form for creating new accounts.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import '../assets/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword, university } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await register({ name, email, password, university });
      updateUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Register for SkillSwap Hub</h2>
        <p className="auth-subtitle">Create an account to start exchanging skills.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="university">University (Optional)</label>
            <input
              type="text"
              id="university"
              name="university"
              value={university}
              onChange={handleChange}
              placeholder="Enter your university name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
