const express = require("express");
const { protectRoute, validateMW } = require("../middlewares/authmw");
const { adminOnly } = require("../middlewares/admin");
const { itemSchema } = require("../validation/validationSchemas");
const { itemLimiter } = require("../middlewares/rateLimiter");
const { report, listLostItems, listFoundItems, searchByItem, resolveItem, approveItem, rejectItem, deleteItem } = require("../controllers/itemController");
const { getMatches, searchItems } = require("../controllers/matchController");
const upload = require("../middlewares/upload");
const { itemModel } = require("../models/itemModel");
const itemRouter = express.Router();

// Apply rate limiting to all item routes
itemRouter.use(itemLimiter);

itemRouter.post("/report", protectRoute, upload.single('image'), report);
itemRouter.get("/lost", protectRoute,listLostItems );
itemRouter.get("/found", protectRoute,listFoundItems );
itemRouter.get("/search", searchItems);
itemRouter.post("/search-by-image", protectRoute, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, msg: 'No image provided' });
    }

    const { generateCLIPEmbedding, generateTruePHash, generateColorHistogram, cosineSimilarity, hammingDistance, hybridSimilarity } = require('../utils/imageSearch');
    const path = require('path');
    const fs = require('fs');

    // Read file from disk storage
    const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const buffer = fs.readFileSync(imagePath);

    // Generate pHash + color histogram for uploaded image (CLIP may fail)
    const [uploadedHash, uploadedColorHist] = await Promise.all([
      generateTruePHash(buffer),
      generateColorHistogram(buffer)
    ]);

    // Try CLIP embedding, but don't fail if it doesn't work
    let uploadedClip = null;
    try {
      uploadedClip = await generateCLIPEmbedding(buffer);
    } catch (clipError) {
      console.log('CLIP embedding failed, falling back to pHash + color histogram:', clipError.message);
    }

    const allItems = await itemModel.find({
      imageUrl: { $exists: true, $ne: null },
      status: { $in: ['pending', 'active'] }
    })
      .populate('reportedBy', 'name email')
      .lean();

    const itemsWithSimilarity = allItems.map(item => {
      let similarity = 0;
      let method = 'none';

      // Enhanced hybrid approach with CLIP, pHash, and color histogram
      if (uploadedClip && item.clipEmbedding && item.clipEmbedding.length > 0) {
        const clipScore = cosineSimilarity(uploadedClip, item.clipEmbedding);
        const phashDist = item.imageHash ? hammingDistance(uploadedHash, item.imageHash) : 64;
        similarity = hybridSimilarity(clipScore, phashDist, uploadedColorHist, item.colorHistogram);
        method = 'enhanced_hybrid';
      }
      // Fallback to pHash + color histogram
      else if (uploadedHash && item.imageHash) {
        const phashDist = hammingDistance(uploadedHash, item.imageHash);
        similarity = hybridSimilarity(null, phashDist, uploadedColorHist, item.colorHistogram);
        method = 'phash_color';
      }
      // Last resort: color histogram only
      else if (uploadedColorHist && item.colorHistogram) {
        similarity = hybridSimilarity(null, null, uploadedColorHist, item.colorHistogram);
        method = 'color_only';
      }

      return { ...item, similarity: Math.round(similarity), method };
    });

    console.log('\nUsing method:', itemsWithSimilarity[0]?.method || 'unknown');

    console.log('\nAll similarities:', itemsWithSimilarity.map(i => ({ title: i.title, similarity: i.similarity, method: i.method })));

    // Use different thresholds based on method - adjusted for CLIP availability
    const threshold = itemsWithSimilarity[0]?.method === 'enhanced_hybrid' ? 60 : 35;
    const results = itemsWithSimilarity
      .filter(i => i.similarity > threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    console.log('Filtered results:', results.map(i => ({ title: i.title, similarity: i.similarity })));

    if (results.length === 0) {
      return res.json({
        success: true,
        count: 0,
        items: [],
        message: 'No matching items found'
      });
    }

    res.json({
      success: true,
      count: results.length,
      items: results
    });

  } catch (error) {
    console.error('Image search error:', error);
    res.status(500).json({ success: false, msg: 'Image processing failed' });
  }
});
itemRouter.get("/matches", protectRoute, getMatches);
itemRouter.get("/my-items", protectRoute, async (req, res) => {
  try {
    const userId = req.std.id;
    const items = await itemModel.find({ reportedBy: userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
itemRouter.get("/all", protectRoute, async (req, res) => {
  try {
    const userRole = req.user?.role;
    const statusFilter = userRole === 'admin'
      ? { $in: ["pending", "active", "resolved"] }
      : "active";

    const items = await itemModel.find({ status: statusFilter }).populate('reportedBy', 'name email').lean();

    res.json({
      success: true,
      count: items.length,
      items: items
    });
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Test route without authentication
itemRouter.get("/test", async (req, res) => {
  try {
    const count = await itemModel.countDocuments();
    const items = await itemModel.find({}).limit(5).lean();

    res.json({
      success: true,
      totalCount: count,
      sampleItems: items,
      message: `Database has ${count} items total`
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// Admin-only routes
itemRouter.patch("/:id/approve", protectRoute, adminOnly, approveItem);
itemRouter.patch("/:id/reject", protectRoute, adminOnly, rejectItem);
itemRouter.delete("/:id", protectRoute, adminOnly, deleteItem);

// Dynamic routes MUST come last
itemRouter.get("/:id", protectRoute, searchByItem);
itemRouter.patch("/:id/resolve", protectRoute, resolveItem);

module.exports = {itemRouter};
