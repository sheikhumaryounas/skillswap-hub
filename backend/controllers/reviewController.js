/**
 * Review Controller
 * 
 * Handles creating and viewing reviews/ratings after sessions.
 */

const Review = require('../models/Review');
const Session = require('../models/Session');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * Create a review for a completed session
 * Route: POST /api/reviews
 * Access: Private
 */
const createReview = async (req, res) => {
  try {
    const { sessionId, rating, comment, tags } = req.body;

    // Find the session
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify session is completed
    if (session.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Can only review completed sessions' 
      });
    }

    // Verify user is part of the session
    if (
      session.teacher.toString() !== req.user._id.toString() &&
      session.learner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Determine who is being reviewed
    const reviewee = req.user._id.toString() === session.teacher.toString() 
      ? session.learner 
      : session.teacher;

    // Check if review already exists
    const existingReview = await Review.findOne({
      session: sessionId,
      reviewer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this session' 
      });
    }

    // Create review
    const review = await Review.create({
      session: sessionId,
      reviewer: req.user._id,
      reviewee: reviewee,
      rating,
      comment,
      tags: tags || []
    });

    // Update reviewee's rating
    const user = await User.findById(reviewee);
    user.calculateRating(rating);
    await user.save();

    // Award points for giving review
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 2 } });

    // Create notification
    await Notification.create({
      recipient: reviewee,
      sender: req.user._id,
      type: 'review_received',
      message: `${req.user.name} left you a ${rating}-star review`,
      relatedEntity: {
        entityType: 'Review',
        entityId: review._id
      }
    });

    // Populate review details
    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name university')
      .populate('reviewee', 'name university')
      .populate('session');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get reviews for a specific user
 * Route: GET /api/reviews/user/:userId
 * Access: Private
 */
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name university rating')
      .populate('session', 'skill date')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get reviews given by current user
 * Route: GET /api/reviews/my-reviews
 * Access: Private
 */
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate('reviewee', 'name university rating')
      .populate('session', 'skill date')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get review for a specific session
 * Route: GET /api/reviews/session/:sessionId
 * Access: Private
 */
const getSessionReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ session: req.params.sessionId })
      .populate('reviewer', 'name university')
      .populate('reviewee', 'name university');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getMyReviews,
  getSessionReviews
};
