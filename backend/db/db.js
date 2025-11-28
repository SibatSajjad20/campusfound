require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.DB_URI;

const connectDb = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("✓ Database connected successfully");
      return;
    } catch (err) {
      console.log(`Database connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        console.error("❌ Failed to connect to database after multiple attempts");
        throw err;
      }
    }
  }
};

module.exports = { connectDb };
