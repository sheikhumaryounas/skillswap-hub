const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token Generate karne ka function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, university } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ 
      name, 
      email, 
      password,
      university: university || ''
    });

    console.log(`New user registered: ${email}`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};