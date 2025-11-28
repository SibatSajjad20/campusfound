const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
  lostItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  foundItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  similarity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

const matchModel = mongoose.model("Match", matchSchema);
module.exports = { matchModel };
