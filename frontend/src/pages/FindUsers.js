/**
 * FindUsers Page
 * 
 * Discover students and their skills.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/userService';
import { createRequest } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import PageBackground from '../components/common/PageBackground';
import '../assets/FindUsers.css';

const FindUsers = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestData, setRequestData] = useState({
    skillOffered: '',
    skillRequested: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      (user.university && user.university.toLowerCase().includes(search)) ||
      (user.skillsOffered && user.skillsOffered.some(s => s.title.toLowerCase().includes(search))) ||
      (user.skillsWanted && user.skillsWanted.some(s => s.title.toLowerCase().includes(search)))
    );
  });

  const handleRequest = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Sending request...' });
    try {
      await createRequest({
        receiverId: selectedUser._id,
        ...requestData
      });
      setStatus({ type: 'success', msg: 'Request sent successfully!' });
      setTimeout(() => setSelectedUser(null), 2000);
    } catch (error) {
      setStatus({ type: 'error', msg: error.response?.data?.message || 'Failed to send request' });
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="find-users-page animate-fade-in">
      <header className="page-header">
        <h1>Discover <span>Skills</span></h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by name or skill (e.g. React, Python)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="users-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user._id} className="card user-card glass">
              <div className="user-card-header">
                <div className="avatar-wrapper">
                  {user.profilePicture && user.profilePicture !== '/uploads/default-avatar.png' ? (
                    <img 
                      src={`http://localhost:5000${user.profilePicture}`} 
                      alt={user.name} 
                      className="user-avatar-img"
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div class="avatar-initial-styled" style="width:100%;height:100%">${user.name.charAt(0)}</div>`; }}
                    />
                  ) : (
                    <div className="avatar-initial-styled">{user.name.charAt(0)}</div>
                  )}
                </div>
                <div className="user-info">
                  <h3>
                    {user.name} 
                    {user._id === currentUser?._id && <span className="self-badge">You</span>}
                  </h3>
                  <p className="institution">{user.university || 'SkillSwap Hub Student'}</p>
                </div>
              </div>
              
              <div className="skills-display">
                <div className="skills-column">
                  <label>Can Teach:</label>
                  <div className="tag-container">
                    {user.skillsOffered && user.skillsOffered.length > 0 ? (
                      user.skillsOffered.map((s, i) => <span key={i} className="tag teaching">{s.title}</span>)
                    ) : (
                      <span className="no-skills">Open for requests</span>
                    )}
                  </div>
                </div>
  
                <div className="skills-column">
                  <label>Learning:</label>
                  <div className="tag-container">
                    {user.skillsWanted && user.skillsWanted.length > 0 ? (
                      user.skillsWanted.map((s, i) => <span key={i} className="tag learning">{s.title}</span>)
                    ) : (
                      <span className="no-skills">Open for suggestions</span>
                    )}
                  </div>
                </div>
              </div>
  
              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (user._id === currentUser?._id) {
                    navigate('/profile');
                    return;
                  }
                  setSelectedUser(user);
                  setRequestData({
                    skillOffered: user.skillsWanted?.[0]?.title || '',
                    skillRequested: user.skillsOffered?.[0]?.title || '',
                    message: `Hi ${user.name}, I noticed we have complementary skills. I'd love to swap skills with you!`
                  });
                }}
              >
                {user._id === currentUser?._id ? 'Your Profile' : 'Propose Swap'}
              </button>
            </div>
          ))
        ) : (
          <div className="no-results animate-fade-in">
            <p>No students found matching "{searchTerm}"</p>
            <span>Try searching for a different skill or name</span>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="card modal-content glass">
            <h2>Propose Swap with {selectedUser.name}</h2>
            <form onSubmit={handleRequest}>
              <div className="input-group">
                <label>Skill you will teach</label>
                <select 
                  value={requestData.skillOffered}
                  onChange={(e) => setRequestData({...requestData, skillOffered: e.target.value})}
                  required
                >
                  <option value="">Select a skill</option>
                  {selectedUser.skillsWanted && selectedUser.skillsWanted.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Skill you want to learn</label>
                <select 
                  value={requestData.skillRequested}
                  onChange={(e) => setRequestData({...requestData, skillRequested: e.target.value})}
                  required
                >
                  <option value="">Select a skill</option>
                  {selectedUser.skillsOffered && selectedUser.skillsOffered.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Personal Message</label>
                <textarea 
                  value={requestData.message}
                  onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                  rows="3"
                ></textarea>
              </div>
              {status.msg && <div className={`message ${status.type}`}>{status.msg}</div>}
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setSelectedUser(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Proposal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindUsers;
