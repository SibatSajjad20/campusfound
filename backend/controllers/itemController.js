const { itemModel } = require("../models/itemModel");
const { findMatches } = require("./matchController");
const imghash = require('imghash');
const path = require('path');

const report = async (req, res) => {
  const reportId = req.std.id;
  try {
    const { title, description, category, location, date, type } = req.body;

    // Manual validation for multipart form data
    if (!title || !description || !category || !location || !date || !type) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required.",
      });
    }

    if (title.length < 3 || title.length > 100) {
      return res.status(400).json({
        success: false,
        msg: "Title must be between 3 and 100 characters.",
      });
    }

    if (description.length < 10 || description.length > 1000) {
      return res.status(400).json({
        success: false,
        msg: "Description must be between 10 and 1000 characters.",
      });
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        msg: "Type must be 'lost' or 'found'.",
      });
    }

    // Handle image upload to Cloudinary and generate embeddings
    let imageUrl = null;
    let imageHash = null;
    let clipEmbedding = null;
    if (req.file) {
      const cloudinary = require('../config/cloudinary');
      const fs = require('fs');
      const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'lostnfound',
        resource_type: 'image'
      });
      
      imageUrl = result.secure_url;
      console.log('Uploaded to Cloudinary:', imageUrl);
      
      // Generate embeddings from buffer
      const buffer = fs.readFileSync(imagePath);
      const { generateCLIPEmbedding, generateTruePHash } = require('../utils/imageSearch');
      
      try {
        const [clip, phash] = await Promise.all([
          generateCLIPEmbedding(buffer).catch(() => null),
          generateTruePHash(buffer)
        ]);
        
        clipEmbedding = clip;
        imageHash = phash;
      } catch (error) {
        console.error('Error generating embeddings:', error);
      }
      
      // Delete local file after upload
      fs.unlinkSync(imagePath);
    }

    const newItem = await itemModel.create({
      title,
      description,
      category,
      location,
      date,
      type,
      reportedBy: reportId,
      status: "pending",
      imageUrl: imageUrl,
      imageHash: imageHash,
      clipEmbedding: clipEmbedding
    });

    // Find potential matches
    const matches = await findMatches(newItem);

    return res.status(201).json({
      success: true,
      msg: "Item successfully reported and pending approval.",
      item: newItem,
      matches: matches.length
    });
  } catch (err) {
    console.error('Report item error:', err);
    return res.status(500).json({
      success: false,
      msg: "Failed to report item. Please try again.",
    });
  }
};

const findItembyType = async (req, res, itemType) => {
  try {
    // Show active items for regular users, all items for admins
    const userRole = req.user?.role;
    const statusFilter = userRole === 'admin'
      ? { $in: ["pending", "active", "resolved"] }
      : "active";

    const findItems = await itemModel
      .find({ type: itemType, status: statusFilter })
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name email _id");
    return res.status(200).json({
      msg: "Items Found",
      count: findItems.length,
      findItems,
    });
  } catch (err) {
    console.error('Find items error:', err);
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch items.",
    });
  }
};

const searchByItem = async (req, res) => {
  const itemId = req.params.id;
  try {
    const findItem = await itemModel
      .findById(itemId)
      .populate("reportedBy", "name email _id");
    if (!findItem) {
      return res.status(401).json({
        success: false,
        msg: "item not found",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "item found",
      item: findItem,
    });
  } catch (err) {
    console.error('Search item error:', err);
    return res.status(500).json({
      success: false,
      msg: "Failed to fetch item.",
    });
  }
};

const resolveItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const resolverId = req.std.id;
    const userRole = req.user.role;
    const item = await itemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        msg: "item not found",
      });
    }
    // Allow if user is owner OR admin
    if (item.reportedBy.toString() !== resolverId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        msg: "only the person who reported can resolve.",
      });
    }
    const updatedItem = await itemModel
      .findByIdAndUpdate(
        itemId,
        { status: "resolved", resolvedBy: resolverId, resolvedAt: new Date() },
        { new: true }
      )
      .populate("reportedBy", "name email _id")
      .populate("resolvedBy", "name email _id");
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        msg: "Item not found",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Item resolved successfully",
      item: updatedItem,
    });
  } catch (err) {
    console.error('Resolve item error:', err);
    return res.status(500).json({
      success: false,
      msg: "Failed to resolve item.",
    });
  }
};

const approveItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await itemModel.findByIdAndUpdate(
      itemId,
      { status: "active" },
      { new: true }
    ).populate("reportedBy", "name email _id");
    if (!item) {
      return res.status(404).json({ success: false, msg: "Item not found" });
    }
    return res.status(200).json({ success: true, msg: "Item approved and now active", item });
  } catch (err) {
    console.error('Approve item error:', err);
    return res.status(500).json({ success: false, msg: "Failed to approve item" });
  }
};

const rejectItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await itemModel.findByIdAndUpdate(
      itemId,
      { status: "rejected" },
      { new: true }
    ).populate("reportedBy", "name email _id");
    if (!item) {
      return res.status(404).json({ success: false, msg: "Item not found" });
    }
    return res.status(200).json({ success: true, msg: "Item rejected", item });
  } catch (err) {
    console.error('Reject item error:', err);
    return res.status(500).json({ success: false, msg: "Failed to reject item" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await itemModel.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ success: false, msg: "Item not found" });
    }
    return res.status(200).json({ success: true, msg: "Item deleted successfully" });
  } catch (err) {
    console.error('Delete item error:', err);
    return res.status(500).json({ success: false, msg: "Failed to delete item" });
  }
};
const listLostItems = (req, res) => findItembyType(req, res, "lost");
const listFoundItems = (req, res) => findItembyType(req, res, "found");
module.exports = {
  report,
  listLostItems,
  listFoundItems,
  searchByItem,
  resolveItem,
  approveItem,
  rejectItem,
  deleteItem,
};
