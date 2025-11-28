require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { student } = require('./models/stdModel');
const { itemModel } = require('./models/itemModel');
const { Conversation, Message } = require('./models/chatModel');
const cloudinary = require('./config/cloudinary');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setupProduction = async () => {
  try {
    console.log('\n🚀 CampusFound Production Setup\n');
    console.log('⚠️  WARNING: This will delete ALL existing data!\n');
    
    const confirm = await question('Type "YES" to continue: ');
    
    if (confirm !== 'YES') {
      console.log('\n❌ Setup cancelled.');
      process.exit(0);
    }

    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Step 1: Clean Cloudinary
    console.log('🗑️  Step 1/3: Cleaning Cloudinary...');
    try {
      const result = await cloudinary.api.delete_resources_by_prefix('lostnfound/', {
        resource_type: 'image'
      });
      console.log(`✅ Deleted ${result.deleted ? Object.keys(result.deleted).length : 0} images\n`);
    } catch (cloudError) {
      console.log('⚠️  Cloudinary cleanup skipped (folder may be empty)\n');
    }

    // Step 2: Clean Database
    console.log('🗑️  Step 2/3: Cleaning database...');
    await itemModel.deleteMany({});
    await student.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log('✅ All collections cleaned\n');

    // Step 3: Create Admin
    console.log('👤 Step 3/3: Create Admin Account\n');
    
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    if (!name || !email || !password || password.length < 6) {
      console.log('\n❌ Invalid input! Name, email, and password (6+ chars) required.');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await student.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('\n✅ Setup Complete!\n');
    console.log('📋 Admin Account Created:');
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}\n`);
    console.log('🎉 Your database is now clean and ready for production!\n');
    console.log('Next steps:');
    console.log('1. Test admin login locally');
    console.log('2. Push to GitHub: git add . && git commit -m "Production ready" && git push');
    console.log('3. Deploy to Render & Vercel (see DEPLOYMENT_CHECKLIST.md)\n');

    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

setupProduction();
