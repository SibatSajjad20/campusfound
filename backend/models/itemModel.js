const { date } = require("joi");
const mongoose = require("mongoose");
const { type } = require("os");

const itemSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    category: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ["lost", "found"], required: true },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    },
    resolvedAt: { type: Date },
    status: { type: String, enum: ["pending", "active", "rejected", "resolved"], default: "pending" },
    imageUrl: { type: String },
    imageHash: { type: String },
    clipEmbedding: [Number], // 768-length CLIP vector
    colorHistogram: {
      r: [Number], // 8-bin red channel histogram
      g: [Number], // 8-bin green channel histogram
      b: [Number]  // 8-bin blue channel histogram
    }
  },
  { timestamps: true }
);
const itemModel = mongoose.model("Item", itemSchema);

module.exports = { itemModel };
