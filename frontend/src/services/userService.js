/**
 * User API Service
 * 
 * Functions for user management, skills, and discovery.
 */

import api from './api';

/**
 * Get all users with optional filters
 * @param {Object} filters - Search and skill filters
 * @returns {Promise} - List of users
 */
export const getAllUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/users?${params}`);
  return response.data;
};

/**
 * Get user by ID
 * @param {String} userId - User ID
 * @returns {Promise} - User data
 */
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - Updated user data
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

/**
 * Add a skill to offer
 * @param {Object} skillData - Skill details (title, level, description)
 * @returns {Promise} - Updated skills offered array
 */
export const addOfferedSkill = async (skillData) => {
  const response = await api.post('/users/skills/offered', skillData);
  return response.data;
};

/**
 * Add a skill wanted to learn
 * @param {Object} skillData - Skill details (title, level)
 * @returns {Promise} - Updated skills wanted array
 */
export const addWantedSkill = async (skillData) => {
  const response = await api.post('/users/skills/wanted', skillData);
  return response.data;
};

/**
 * Remove an offered skill
 * @param {String} skillId - Skill ID to remove
 * @returns {Promise} - Updated skills offered array
 */
export const removeOfferedSkill = async (skillId) => {
  const response = await api.delete(`/users/skills/offered/${skillId}`);
  return response.data;
};

/**
 * Remove a wanted skill
 * @param {String} skillId - Skill ID to remove
 * @returns {Promise} - Updated skills wanted array
 */
export const removeWantedSkill = async (skillId) => {
  const response = await api.delete(`/users/skills/wanted/${skillId}`);
  return response.data;
};

/**
 * Get leaderboard - top users by points
 * @returns {Promise} - Top users array
 */
export const getLeaderboard = async () => {
  const response = await api.get('/users/leaderboard');
  return response.data;
};
