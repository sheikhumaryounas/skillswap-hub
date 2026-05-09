/**
 * Review Routes
 * 
 * Defines routes for creating and viewing reviews/ratings.
 */

const express = require('express');
const router = express.Router();
const {
  createReview,
  getUserReviews,
  getMyReviews,
  getSessionReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createReview);
router.get('/my-reviews', getMyReviews);
router.get('/user/:userId', getUserReviews);
router.get('/session/:sessionId', getSessionReviews);

module.exports = router;
