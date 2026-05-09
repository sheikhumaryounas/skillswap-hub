/**
 * Request Routes
 * 
 * Defines routes for creating and managing skill exchange requests.
 */

const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  deleteRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createRequest);
router.get('/', getMyRequests);
router.get('/:id', getRequestById);
router.put('/:id/accept', acceptRequest);
router.put('/:id/reject', rejectRequest);
router.delete('/:id', deleteRequest);

module.exports = router;
