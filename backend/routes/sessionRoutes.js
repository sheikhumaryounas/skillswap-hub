/**
 * Session Routes
 * 
 * Defines routes for creating and managing learning sessions.
 */

const express = require('express');
const router = express.Router();
const {
  createSession,
  getMySessions,
  getSessionById,
  updateSession,
  completeSession,
  cancelSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createSession);
router.get('/', getMySessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.put('/:id/complete', completeSession);
router.put('/:id/cancel', cancelSession);

module.exports = router;
