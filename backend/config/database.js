/**
 * Database Configuration
 * 
 * This file handles the connection to MongoDB database.
 * It uses Mongoose ODM for database operations.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from .env file
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure if connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
