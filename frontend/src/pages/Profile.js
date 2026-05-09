/**
 * Profile Page
 * 
 * User profile management - view and edit profile, manage skills.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, addOfferedSkill, addWantedSkill, removeOfferedSkill, removeWantedSkill } from '../services/userService';
import { getProfile } from '../services/authService';
import '../assets/Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    university: '',
  });
  const [newOfferedSkill, setNewOfferedSkill] = useState({
    title: '',
    level: 'Beginner',
    description: '',
  });
  const [newWantedSkill, setNewWantedSkill] = useState({
    title: '',
    level: 'Beginner',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        university: user.university || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateProfile(formData);
      const updatedUser = await getProfile();
      updateUser(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddOfferedSkill = async (e) => {
    e.preventDefault();
    try {
      await addOfferedSkill(newOfferedSkill);
      const updatedUser = await getProfile();
      updateUser(updatedUser);
      setNewOfferedSkill({ title: '', level: 'Beginner', description: '' });
      setMessage('Skill added successfully!');
    } catch (error) {
      setMessage('Error adding skill: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddWantedSkill = async (e) => {
    e.preventDefault();
    try {
      await addWantedSkill(newWantedSkill);
      const updatedUser = await getProfile();
      updateUser(updatedUser);
      setNewWantedSkill({ title: '', level: 'Beginner' });
      setMessage('Skill added successfully!');
    } catch (error) {
      setMessage('Error adding skill: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveOfferedSkill = async (skillId) => {
    try {
      await removeOfferedSkill(skillId);
      const updatedUser = await getProfile();
      updateUser(updatedUser);
      setMessage('Skill removed successfully!');
    } catch (error) {
      setMessage('Error removing skill: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveWantedSkill = async (skillId) => {
    try {
      await removeWantedSkill(skillId);
      const updatedUser = await getProfile();
      updateUser(updatedUser);
      setMessage('Skill removed successfully!');
    } catch (error) {
      setMessage('Error removing skill: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {message && <div className="message">{message}</div>}

      {/* Profile Information Section */}
      <div className="profile-section">
        <h2>Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows="4"
              placeholder="Tell others about yourself..."
            />
          </div>

          <div className="form-group">
            <label>University</label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              placeholder="Your university name"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="user-stats">
          <div className="stat-item">
            <strong>Points:</strong> {user?.points || 0}
          </div>
          <div className="stat-item">
            <strong>Rating:</strong> ⭐ {user?.rating?.toFixed(1) || '0.0'}
          </div>
          <div className="stat-item">
            <strong>Reviews:</strong> {user?.totalRatings || 0}
          </div>
        </div>
      </div>

      {/* Skills Offered Section */}
      <div className="profile-section">
        <h2>Skills I Can Teach</h2>
        <div className="skills-list">
          {user?.skillsOffered && user.skillsOffered.length > 0 ? (
            user.skillsOffered.map((skill) => (
              <div key={skill._id} className="skill-item">
                <div>
                  <strong>{skill.title}</strong>
                  <span className="skill-level"> ({skill.level})</span>
                  {skill.description && <p>{skill.description}</p>}
                </div>
                <button onClick={() => handleRemoveOfferedSkill(skill._id)} className="btn-remove">
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No skills added yet</p>
          )}
        </div>

        <form onSubmit={handleAddOfferedSkill} className="add-skill-form">
          <h3>Add New Skill</h3>
          <input
            type="text"
            placeholder="Skill name"
            value={newOfferedSkill.title}
            onChange={(e) => setNewOfferedSkill({ ...newOfferedSkill, title: e.target.value })}
            required
          />
          <select
            value={newOfferedSkill.level}
            onChange={(e) => setNewOfferedSkill({ ...newOfferedSkill, level: e.target.value })}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
          <input
            type="text"
            placeholder="Description (optional)"
            value={newOfferedSkill.description}
            onChange={(e) => setNewOfferedSkill({ ...newOfferedSkill, description: e.target.value })}
          />
          <button type="submit" className="btn btn-success">Add Skill</button>
        </form>
      </div>

      {/* Skills Wanted Section */}
      <div className="profile-section">
        <h2>Skills I Want to Learn</h2>
        <div className="skills-list">
          {user?.skillsWanted && user.skillsWanted.length > 0 ? (
            user.skillsWanted.map((skill) => (
              <div key={skill._id} className="skill-item">
                <div>
                  <strong>{skill.title}</strong>
                  <span className="skill-level"> ({skill.level})</span>
                </div>
                <button onClick={() => handleRemoveWantedSkill(skill._id)} className="btn-remove">
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No skills added yet</p>
          )}
        </div>

        <form onSubmit={handleAddWantedSkill} className="add-skill-form">
          <h3>Add New Skill</h3>
          <input
            type="text"
            placeholder="Skill name"
            value={newWantedSkill.title}
            onChange={(e) => setNewWantedSkill({ ...newWantedSkill, title: e.target.value })}
            required
          />
          <select
            value={newWantedSkill.level}
            onChange={(e) => setNewWantedSkill({ ...newWantedSkill, level: e.target.value })}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
          <button type="submit" className="btn btn-success">Add Skill</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
