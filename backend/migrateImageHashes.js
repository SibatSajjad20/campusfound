// Script to pre-compute hashes for existing items
// Usage: node migrateImageHashes.js

require('dotenv').config();
const mongoose = require('mongoose');
const { itemModel } = require('./models/itemModel');
const { generatePHash } = require('./utils/imageHash');

const migrateHashes = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    const items = await itemModel.find({ imageUrl: { $exists: true, $ne: null } });
    console.log(`Found ${items.length} items with images`);

    let success = 0;
    let failed = 0;

    for (let item of items) {
      try {
        const hash = await generatePHash(item.imageUrl);
        await itemModel.updateOne({ _id: item._id }, { imageHash: hash });
        console.log(`✓ Hashed: ${item.title} (${item._id})`);
        success++;
      } catch (e) {
        console.log(`✗ Failed: ${item.title} (${item._id}) - ${e.message}`);
        failed++;
      }
    }

    console.log(`\nMigration complete: ${success} success, ${failed} failed`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateHashes();
