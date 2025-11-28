// Script to migrate existing items to new status system
// This will update all items with old status values to new ones

require('dotenv').config();
const mongoose = require('mongoose');
const { itemModel } = require('./models/itemModel');

const migrateItems = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update items with old 'open' status to 'active'
    const openToActive = await itemModel.updateMany(
      { status: 'open' },
      { $set: { status: 'active' } }
    );
    console.log(`✓ Updated ${openToActive.modifiedCount} items from 'open' to 'active'`);

    // Update items with old 'approved' status to 'active'
    const approvedToActive = await itemModel.updateMany(
      { status: 'approved' },
      { $set: { status: 'active' } }
    );
    console.log(`✓ Updated ${approvedToActive.modifiedCount} items from 'approved' to 'active'`);

    // Update items with old 'resolved' status (keep as 'resolved')
    const resolvedCount = await itemModel.countDocuments({ status: 'resolved' });
    console.log(`✓ Found ${resolvedCount} already resolved items (no change needed)`);

    // Set default status for items without status
    const noStatus = await itemModel.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );
    console.log(`✓ Updated ${noStatus.modifiedCount} items without status to 'active'`);

    // Summary
    const totalItems = await itemModel.countDocuments();
    const statusCounts = await itemModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Current Status Distribution:');
    statusCounts.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count}`);
    });
    console.log(`   Total: ${totalItems}`);

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
};

migrateItems();
