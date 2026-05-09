/**
 * User Routes
 * 
 * Defines routes for user profile management, skills, and user discovery.
 */

const express = require('express');
const router = express.Router();
const {
  updateProfile,
  addOfferedSkill,
  addWantedSkill,
  removeOfferedSkill,
  removeWantedSkill,
  getAllUsers,
  getUserById,
  getLeaderboard
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)
router.use(protect);

// Profile routes
router.put('/profile', updateProfile);

// Skill management routes
router.post('/skills/offered', addOfferedSkill);
router.post('/skills/wanted', addWantedSkill);
router.delete('/skills/offered/:skillId', removeOfferedSkill);
router.delete('/skills/wanted/:skillId', removeWantedSkill);

// User discovery routes
router.get('/', getAllUsers);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserById);

module.exports = router;
