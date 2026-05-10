/**
 * Session Controller
 * 
 * Handles creating and managing learning sessions between users.
 */

const Session = require('../models/Session');
const Request = require('../models/Request');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a new session (after request is accepted)
 * Route: POST /api/sessions
 * Access: Private
 */
const createSession = async (req, res) => {
  try {
    const { requestId, date, time, duration, location, notes } = req.body;
    
    if (!requestId) {
      return res.status(400).json({ message: 'Please select an accepted request' });
    }

    // Find the request
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Verify request is accepted
    if (request.status !== 'accepted') {
      return res.status(400).json({ 
        message: 'Can only create session for accepted requests' 
      });
    }

    // Verify user is part of the request
    if (
      request.sender.toString() !== req.user._id.toString() &&
      request.receiver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if session already exists for this request
    const existingSession = await Session.findOne({ request: requestId });
    if (existingSession) {
      return res.status(400).json({ 
        message: 'Session already exists for this request' 
      });
    }

    // Create session
    const session = await Session.create({
      request: requestId,
      teacher: request.receiver,
      learner: request.sender,
      skill: request.skillRequested,
      date,
      time,
      duration: duration || 60,
      location: location || 'To be decided',
      notes
    });

    // Create notification for the other user
    const otherUserId = req.user._id.toString() === request.sender.toString() 
      ? request.receiver 
      : request.sender;

    await Notification.create({
      recipient: otherUserId,
      sender: req.user._id,
      type: 'session_scheduled',
      message: `A session has been scheduled for ${request.skillRequested}`,
      relatedEntity: {
        entityType: 'Session',
        entityId: session._id
      }
    });

    // Populate session details
    const populatedSession = await Session.findById(session._id)
      .populate('teacher', 'name email university')
      .populate('learner', 'name email university')
      .populate('request');

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all sessions for current user
 * Route: GET /api/sessions
 * Access: Private
 */
const getMySessions = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query - find sessions where user is teacher or learner
    let query = {
      $or: [
        { teacher: req.user._id },
        { learner: req.user._id }
      ]
    };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .populate('teacher', 'name email university rating')
      .populate('learner', 'name email university rating')
      .populate('request')
      .sort({ date: 1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single session by ID
 * Route: GET /api/sessions/:id
 * Access: Private
 */
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('teacher', 'name email university rating')
      .populate('learner', 'name email university rating')
      .populate('request');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is part of this session
    if (
      session.teacher._id.toString() !== req.user._id.toString() &&
      session.learner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this session' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update session details
 * Route: PUT /api/sessions/:id
 * Access: Private
 */
const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is part of this session
    if (
      session.teacher.toString() !== req.user._id.toString() &&
      session.learner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields if provided
    if (req.body.date) session.date = req.body.date;
    if (req.body.time) session.time = req.body.time;
    if (req.body.duration) session.duration = req.body.duration;
    if (req.body.location) session.location = req.body.location;
    if (req.body.notes) session.notes = req.body.notes;
    if (req.body.status) session.status = req.body.status;

    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate('teacher', 'name email university')
      .populate('learner', 'name email university')
      .populate('request');

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Mark session as completed
 * Route: PUT /api/sessions/:id/complete
 * Access: Private
 */
const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is part of this session
    if (
      session.teacher.toString() !== req.user._id.toString() &&
      session.learner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status
    session.status = 'completed';
    await session.save();

    // Award points to both participants
    await User.findByIdAndUpdate(session.teacher, { $inc: { points: 10 } });
    await User.findByIdAndUpdate(session.learner, { $inc: { points: 10 } });

    // Update related request status
    await Request.findByIdAndUpdate(session.request, { status: 'completed' });

    const updatedSession = await Session.findById(session._id)
      .populate('teacher', 'name email university')
      .populate('learner', 'name email university')
      .populate('request');

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cancel a session
 * Route: PUT /api/sessions/:id/cancel
 * Access: Private
 */
const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is part of this session
    if (
      session.teacher.toString() !== req.user._id.toString() &&
      session.learner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status
    session.status = 'cancelled';
    await session.save();

    // Notify the other user
    const otherUserId = req.user._id.toString() === session.teacher.toString() 
      ? session.learner 
      : session.teacher;

    await Notification.create({
      recipient: otherUserId,
      sender: req.user._id,
      type: 'session_cancelled',
      message: `Session for ${session.skill} has been cancelled`,
      relatedEntity: {
        entityType: 'Session',
        entityId: session._id
      }
    });

    const updatedSession = await Session.findById(session._id)
      .populate('teacher', 'name email university')
      .populate('learner', 'name email university')
      .populate('request');

    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSession,
  getMySessions,
  getSessionById,
  updateSession,
  completeSession,
  cancelSession
};
