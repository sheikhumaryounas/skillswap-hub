/**
 * Database Seeder
 * 
 * This script populates the database with initial sample data for testing.
 * It creates users and sample skill swap requests.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Request = require('../models/Request');
const Session = require('../models/Session');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

dotenv.config();

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    role: 'student',
    skillsToTeach: ['React', 'JavaScript', 'CSS'],
    skillsToLearn: ['Python', 'Data Science'],
    bio: 'CS student passionate about frontend development.',
    institution: 'Tech University',
    rating: 4.8
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    role: 'student',
    skillsToTeach: ['Python', 'Machine Learning'],
    skillsToLearn: ['React', 'Node.js'],
    bio: 'Data Science enthusiast looking to learn fullstack.',
    institution: 'City College',
    rating: 4.5
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password123',
    role: 'student',
    skillsToTeach: ['Graphic Design', 'UI/UX'],
    skillsToLearn: ['JavaScript', 'HTML'],
    bio: 'Design student wanting to add coding to my toolkit.',
    institution: 'Arts Institute',
    rating: 4.9
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Request.deleteMany({});
    await Session.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data.');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users.`);

    // Create a sample request
    await Request.create({
      sender: createdUsers[0]._id,
      receiver: createdUsers[1]._id,
      skillOffered: 'React',
      skillRequested: 'Python',
      message: 'Hey Bob, I saw you want to learn React. I can help with that if you teach me some Python!',
      status: 'pending'
    });
    console.log('Created sample request.');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
