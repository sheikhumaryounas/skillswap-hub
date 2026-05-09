const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Note: Agar tumne authController mein "getProfile" ka function abhi nahi banaya
// toh filhal is route ko hum comment kar rahe hain taake error na aaye. 
// Jab function banayenge toh isko uncomment kar lenge.
// router.get('/profile', protect, getProfile);

module.exports = router;