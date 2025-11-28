require('dotenv').config();
const mongoose = require('mongoose');
const { student } = require('./models/stdModel');
const { itemModel } = require('./models/itemModel');
const { Conversation, Message } = require('./models/chatModel');
const cloudinary = require('./config/cloudinary');

const cleanDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete all Cloudinary images
    console.log('🗑️  Deleting all images from Cloudinary...');
    try {
      const result = await cloudinary.api.delete_resources_by_prefix('lostnfound/', {
        resource_type: 'image'
      });
      console.log(`✅ Deleted ${result.deleted ? Object.keys(result.deleted).length : 0} images from Cloudinary\n`);
    } catch (cloudError) {
      console.log('⚠️  Cloudinary cleanup skipped (folder may be empty)\n');
    }

    // Delete all collections
    console.log('🗑️  Cleaning database collections...');
    
    const itemsDeleted = await itemModel.deleteMany({});
    console.log(`✅ Deleted ${itemsDeleted.deletedCount} items`);
    
    const studentsDeleted = await student.deleteMany({});
    console.log(`✅ Deleted ${studentsDeleted.deletedCount} students`);
    
    const conversationsDeleted = await Conversation.deleteMany({});
    console.log(`✅ Deleted ${conversationsDeleted.deletedCount} conversations`);
    
    const messagesDeleted = await Message.deleteMany({});
    console.log(`✅ Deleted ${messagesDeleted.deletedCount} messages\n`);

    console.log('✨ Database cleaned successfully!');
    console.log('📝 Next step: Run createAdmin.js to create your admin account\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error.message);
    process.exit(1);
  }
};

cleanDatabase();
