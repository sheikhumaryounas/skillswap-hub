/**
 * Request Controller
 * 
 * Handles creating, managing, and responding to skill exchange requests.
 */

const Request = require('../models/Request');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a new skill exchange request
 * Route: POST /api/requests
 * Access: Private
 */
const createRequest = async (req, res) => {
  try {
    const { receiverId, skillRequested, skillOffered, message } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Check if user is trying to send request to themselves
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    // Check if a pending request already exists
    const existingRequest = await Request.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: 'You already have a pending request with this user' 
      });
    }

    // Create new request
    const request = await Request.create({
      sender: req.user._id,
      receiver: receiverId,
      skillRequested,
      skillOffered,
      message
    });

    // Create notification for receiver
    await Notification.create({
      recipient: receiverId,
      sender: req.user._id,
      type: 'request_received',
      message: `${req.user.name} wants to learn ${skillRequested} from you`,
      relatedEntity: {
        entityType: 'Request',
        entityId: request._id
      }
    });

    // Populate sender and receiver details
    const populatedRequest = await Request.findById(request._id)
      .populate('sender', 'name email university rating')
      .populate('receiver', 'name email university rating');

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all requests (sent and received by current user)
 * Route: GET /api/requests
 * Access: Private
 */
const getMyRequests = async (req, res) => {
  try {
    const { type } = req.query; // 'sent' or 'received'

    let query;
    if (type === 'sent') {
      query = { sender: req.user._id };
    } else if (type === 'received') {
      query = { receiver: req.user._id };
    } else {
      // Get both sent and received
      query = {
        $or: [
          { sender: req.user._id },
          { receiver: req.user._id }
        ]
      };
    }

    const requests = await Request.find(query)
      .populate('sender', 'name email university rating')
      .populate('receiver', 'name email university rating')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single request by ID
 * Route: GET /api/requests/:id
 * Access: Private
 */
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('sender', 'name email university rating skillsOffered')
      .populate('receiver', 'name email university rating skillsOffered');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Verify user is part of this request
    if (
      request.sender._id.toString() !== req.user._id.toString() &&
      request.receiver._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Accept a request
 * Route: PUT /api/requests/:id/accept
 * Access: Private
 */
const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Verify user is the receiver
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Only the receiver can accept this request' 
      });
    }

    // Check if already accepted
    if (request.status === 'accepted') {
      return res.status(400).json({ message: 'Request already accepted' });
    }

    // Update request status
    request.status = 'accepted';
    await request.save();

    // Award points to both users
    await User.findByIdAndUpdate(request.sender, { $inc: { points: 5 } });
    await User.findByIdAndUpdate(request.receiver, { $inc: { points: 5 } });

    // Create notification for sender
    await Notification.create({
      recipient: request.sender,
      sender: req.user._id,
      type: 'request_accepted',
      message: `${req.user.name} accepted your request to learn ${request.skillRequested}`,
      relatedEntity: {
        entityType: 'Request',
        entityId: request._id
      }
    });

    const updatedRequest = await Request.findById(request._id)
      .populate('sender', 'name email university rating')
      .populate('receiver', 'name email university rating');

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Reject a request
 * Route: PUT /api/requests/:id/reject
 * Access: Private
 */
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Verify user is the receiver
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Only the receiver can reject this request' 
      });
    }

    // Update request status
    request.status = 'rejected';
    await request.save();

    // Create notification for sender
    await Notification.create({
      recipient: request.sender,
      sender: req.user._id,
      type: 'request_rejected',
      message: `${req.user.name} declined your request`,
      relatedEntity: {
        entityType: 'Request',
        entityId: request._id
      }
    });

    const updatedRequest = await Request.findById(request._id)
      .populate('sender', 'name email university rating')
      .populate('receiver', 'name email university rating');

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a request
 * Route: DELETE /api/requests/:id
 * Access: Private
 */
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only sender can delete their own request
    if (request.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'You can only delete your own requests' 
      });
    }

    await request.deleteOne();
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getRequestById,
  acceptRequest,
  rejectRequest,
  deleteRequest
};
