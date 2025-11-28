// Migration script to backfill color histograms for existing items
// Usage: node migrateColorHistograms.js

require('dotenv').config();
const mongoose = require('mongoose');
const { itemModel } = require('./models/itemModel');
const { generateColorHistogram } = require('./utils/imageSearch');
const fs = require('fs');
const path = require('path');

const migrateColorHistograms = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB\n');

    const items = await itemModel.find({
      imageUrl: { $exists: true, $ne: null },
      $or: [
        { colorHistogram: { $exists: false } },
        { colorHistogram: null }
      ]
    });
    console.log(`Found ${items.length} items needing color histograms\n`);

    let success = 0;
    let failed = 0;

    for (let item of items) {
      try {
        const imagePath = path.join(__dirname, item.imageUrl);
        const buffer = fs.readFileSync(imagePath);

        console.log(`Processing: ${item.title}...`);

        // Generate color histogram
        const colorHistogram = await generateColorHistogram(buffer);

        await itemModel.updateOne(
          { _id: item._id },
          { colorHistogram: colorHistogram }
        );

        console.log(`✓ Success: ${item.title} (Color histogram added)\n`);
        success++;
      } catch (e) {
        console.log(`✗ Failed: ${item.title} - ${e.message}\n`);
        failed++;
      }
    }

    console.log(`\n=== Color Histogram Migration Complete ===`);
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateColorHistograms();
