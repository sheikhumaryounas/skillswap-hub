const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for cleanup...');

    const dummyNames = ['Alice Johnson', 'Bob Smith', 'Charlie Brown'];
    
    const result = await User.deleteMany({ name: { $in: dummyNames } });
    
    console.log(`Deleted ${result.deletedCount} dummy users.`);
    
    process.exit();
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

cleanup();
