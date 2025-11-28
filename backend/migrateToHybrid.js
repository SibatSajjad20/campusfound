// Migration script to backfill CLIP embeddings and fix pHash for existing items
// Usage: node migrateToHybrid.js

require('dotenv').config();
const mongoose = require('mongoose');
const { itemModel } = require('./models/itemModel');
const { generateCLIPEmbedding, generateTruePHash } = require('./utils/imageSearch');
const fs = require('fs');
const path = require('path');

const migrateToHybrid = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB\n');

    const items = await itemModel.find({ imageUrl: { $exists: true, $ne: null } });
    console.log(`Found ${items.length} items with images\n`);

    let success = 0;
    let failed = 0;

    for (let item of items) {
      try {
        const imagePath = path.join(__dirname, item.imageUrl);
        const buffer = fs.readFileSync(imagePath);

        console.log(`Processing: ${item.title}...`);

        // Generate both CLIP and pHash
        const [clipEmbedding, imageHash] = await Promise.all([
          generateCLIPEmbedding(buffer),
          generateTruePHash(buffer)
        ]);

        await itemModel.updateOne(
          { _id: item._id },
          { 
            clipEmbedding: clipEmbedding,
            imageHash: imageHash
          }
        );

        console.log(`✓ Success: ${item.title} (CLIP: ${clipEmbedding ? 'Yes' : 'No'}, pHash: ${imageHash ? 'Yes' : 'No'})\n`);
        success++;
      } catch (e) {
        console.log(`✗ Failed: ${item.title} - ${e.message}\n`);
        failed++;
      }
    }

    console.log(`\n=== Migration Complete ===`);
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateToHybrid();
