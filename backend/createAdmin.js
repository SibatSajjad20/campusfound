require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { student } = require('./models/stdModel');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📝 Create Admin Account\n');
    
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    if (!name || !email || !password) {
      console.log('\n❌ All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters!');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await student.findOne({ email });
    if (existingUser) {
      console.log('\n❌ User with this email already exists!');
      process.exit(1);
    }

    // Hash password
    console.log('\n🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    console.log('👤 Creating admin account...');
    const admin = await student.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('\n📋 Admin Details:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin._id}\n`);

    console.log('🚀 You can now login with these credentials!\n');

    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    rl.close();
    process.exit(1);
  }
};

createAdmin();
