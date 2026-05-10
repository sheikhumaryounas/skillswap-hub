const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile route (Protected)
router.get('/profile', protect, getProfile);

module.exports = router;