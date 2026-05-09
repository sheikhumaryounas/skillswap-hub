/**
 * Session API Service
 * 
 * Functions for managing learning sessions.
 */

import api from './api';

/**
 * Create a new session
 * @param {Object} sessionData - Session details
 * @returns {Promise} - Created session
 */
export const createSession = async (sessionData) => {
  const response = await api.post('/sessions', sessionData);
  return response.data;
};

/**
 * Get user's sessions
 * @param {String} status - Filter by status (optional)
 * @returns {Promise} - List of sessions
 */
export const getMySessions = async (status) => {
  const params = status ? `?status=${status}` : '';
  const response = await api.get(`/sessions${params}`);
  return response.data;
};

/**
 * Get session by ID
 * @param {String} sessionId - Session ID
 * @returns {Promise} - Session data
 */
export const getSessionById = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data;
};

/**
 * Update session details
 * @param {String} sessionId - Session ID
 * @param {Object} updateData - Updated session data
 * @returns {Promise} - Updated session
 */
export const updateSession = async (sessionId, updateData) => {
  const response = await api.put(`/sessions/${sessionId}`, updateData);
  return response.data;
};

/**
 * Mark session as completed
 * @param {String} sessionId - Session ID
 * @returns {Promise} - Updated session
 */
export const completeSession = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/complete`);
  return response.data;
};

/**
 * Cancel a session
 * @param {String} sessionId - Session ID
 * @returns {Promise} - Updated session
 */
export const cancelSession = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/cancel`);
  return response.data;
};
