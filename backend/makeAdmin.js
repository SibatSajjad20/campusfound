// Script to make a user an admin
// Usage: node makeAdmin.js <email>

require('dotenv').config();
const mongoose = require('mongoose');
const { student } = require('./models/stdModel');

const makeAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await student.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✓ Successfully made ${user.name} (${user.email}) an admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js your-email@gmail.com');
  process.exit(1);
}

makeAdmin(email);
