/**
 * User Model
 * 
 * This schema defines the structure for storing user information in MongoDB.
 * It includes authentication details, skills, ratings, and points for gamification.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(v) {
        // At least one uppercase letter and one special character
        return /(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/.test(v);
      },
      message: 'Password must contain at least one uppercase letter and one special character'
    },
    select: false // Don't return password in queries by default
  },
  
  // Profile information
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  
  university: {
    type: String,
    trim: true,
    default: ''
  },
  
  profilePicture: {
    type: String,
    default: '/uploads/default-avatar.png'
  },
  
  // Skills that the user can teach to others
  skillsOffered: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      required: true
    },
    description: {
      type: String,
      maxlength: 200
    }
  }],
  
  // Skills that the user wants to learn
  skillsWanted: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      required: true
    }
  }],
  
  // Rating system for user reputation
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Total number of ratings received
  totalRatings: {
    type: Number,
    default: 0
  },
  
  // Points for gamification and leaderboard
  points: {
    type: Number,
    default: 0
  },
  
  // Track when user was created and last updated
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Pre-save middleware to hash password before saving to database
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in database
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to calculate average rating
userSchema.methods.calculateRating = function(newRating) {
  const totalScore = this.rating * this.totalRatings;
  this.totalRatings += 1;
  this.rating = (totalScore + newRating) / this.totalRatings;
};

module.exports = mongoose.model('User', userSchema);
