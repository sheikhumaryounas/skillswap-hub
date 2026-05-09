/**
 * Request API Service
 * 
 * Functions for managing skill exchange requests.
 */

import api from './api';

/**
 * Create a new skill exchange request
 * @param {Object} requestData - Request details
 * @returns {Promise} - Created request
 */
export const createRequest = async (requestData) => {
  const response = await api.post('/requests', requestData);
  return response.data;
};

/**
 * Get user's requests (sent and received)
 * @param {String} type - 'sent', 'received', or undefined for both
 * @returns {Promise} - List of requests
 */
export const getMyRequests = async (type) => {
  const params = type ? `?type=${type}` : '';
  const response = await api.get(`/requests${params}`);
  return response.data;
};

/**
 * Get request by ID
 * @param {String} requestId - Request ID
 * @returns {Promise} - Request data
 */
export const getRequestById = async (requestId) => {
  const response = await api.get(`/requests/${requestId}`);
  return response.data;
};

/**
 * Accept a request
 * @param {String} requestId - Request ID
 * @returns {Promise} - Updated request
 */
export const acceptRequest = async (requestId) => {
  const response = await api.put(`/requests/${requestId}/accept`);
  return response.data;
};

/**
 * Reject a request
 * @param {String} requestId - Request ID
 * @returns {Promise} - Updated request
 */
export const rejectRequest = async (requestId) => {
  const response = await api.put(`/requests/${requestId}/reject`);
  return response.data;
};

/**
 * Delete a request
 * @param {String} requestId - Request ID
 * @returns {Promise} - Success message
 */
export const deleteRequest = async (requestId) => {
  const response = await api.delete(`/requests/${requestId}`);
  return response.data;
};
