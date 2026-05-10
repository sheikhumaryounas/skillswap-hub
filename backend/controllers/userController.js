/**
 * User Controller
 * 
 * Handles user profile operations, searching users,
 * and managing skills.
 */

const User = require('../models/User');
const Request = require('../models/Request');
const Session = require('../models/Session');
const Notification = require('../models/Notification');

/**
 * Update user profile
 * Route: PUT /api/users/profile
 * Access: Private
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update fields if provided in request body
      if (req.body.name !== undefined) user.name = req.body.name;
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.university !== undefined) user.university = req.body.university;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        university: updatedUser.university,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        skillsOffered: updatedUser.skillsOffered,
        skillsWanted: updatedUser.skillsWanted,
        points: updatedUser.points,
        rating: updatedUser.rating
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add a skill that the user can offer/teach
 * Route: POST /api/users/skills/offered
 * Access: Private
 */
const addOfferedSkill = async (req, res) => {
  try {
    const { title, level, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a skill title' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      // Check if skill already exists
      const skillExists = user.skillsOffered.find(
        skill => skill.title.toLowerCase() === title.toLowerCase()
      );

      if (skillExists) {
        return res.status(400).json({ message: 'You already offer this skill' });
      }

      // Add new skill to skillsOffered array
      user.skillsOffered.push({ title, level, description });
      await user.save();

      res.status(201).json(user.skillsOffered);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add a skill that the user wants to learn
 * Route: POST /api/users/skills/wanted
 * Access: Private
 */
const addWantedSkill = async (req, res) => {
  try {
    const { title, level } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a skill title' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      // Check if skill already exists
      const skillExists = user.skillsWanted.find(
        skill => skill.title.toLowerCase() === title.toLowerCase()
      );

      if (skillExists) {
        return res.status(400).json({ message: 'This skill is already in your wanted list' });
      }

      // Add new skill to skillsWanted array
      user.skillsWanted.push({ title, level });
      await user.save();

      res.status(201).json(user.skillsWanted);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove an offered skill
 * Route: DELETE /api/users/skills/offered/:skillId
 * Access: Private
 */
const removeOfferedSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Filter out the skill with matching ID
      user.skillsOffered = user.skillsOffered.filter(
        skill => skill._id.toString() !== req.params.skillId
      );
      await user.save();

      res.json(user.skillsOffered);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove a wanted skill
 * Route: DELETE /api/users/skills/wanted/:skillId
 * Access: Private
 */
const removeWantedSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Filter out the skill with matching ID
      user.skillsWanted = user.skillsWanted.filter(
        skill => skill._id.toString() !== req.params.skillId
      );
      await user.save();

      res.json(user.skillsWanted);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all users (for browsing and matching)
 * Route: GET /api/users
 * Access: Private
 */
const getAllUsers = async (req, res) => {
  try {
    const { search, skill } = req.query;

    // Build query object
    let query = {}; // Include all users

    // Search by name or university
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by skill offered
    if (skill) {
      query['skillsOffered.title'] = { $regex: skill, $options: 'i' };
    }

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ rating: -1, points: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a single user by ID
 * Route: GET /api/users/:id
 * Access: Private
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get leaderboard - top users by points
 * Route: GET /api/users/leaderboard
 * Access: Private
 */
const getLeaderboard = async (req, res) => {
  try {
    // Get top 10 users sorted by points
    const topUsers = await User.find()
      .select('name university points rating totalRatings profilePicture')
      .sort({ points: -1 })
      .limit(10);

    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Upload profile picture
 * Route: POST /api/users/profile-picture
 * Access: Private
 */
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.profilePicture = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ 
        message: 'Profile picture updated', 
        profilePicture: user.profilePicture 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove profile picture (reset to default)
 * Route: DELETE /api/users/profile-picture
 * Access: Private
 */
const removeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.profilePicture = '/uploads/default-avatar.png';
      await user.save();
      res.json({ 
        message: 'Profile picture removed', 
        profilePicture: user.profilePicture 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete user account permanently
 * Route: DELETE /api/users/profile
 * Access: Private
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user's requests (where they are sender or receiver)
    await Request.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }]
    });

    // Delete user's sessions (where they are teacher or learner)
    await Session.deleteMany({
      $or: [{ teacher: userId }, { learner: userId }]
    });

    // Delete user's notifications
    await Notification.deleteMany({ recipient: userId });

    // Delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateProfile,
  uploadProfilePicture,
  removeProfilePicture,
  addOfferedSkill,
  addWantedSkill,
  removeOfferedSkill,
  removeWantedSkill,
  getAllUsers,
  getUserById,
  getLeaderboard,
  deleteAccount
};
