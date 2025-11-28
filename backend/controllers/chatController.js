const { Conversation, Message } = require("../models/chatModel");
const { itemModel } = require("../models/itemModel");

const getOrCreateConversation = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.std.id;

    const item = await itemModel.findById(itemId).populate("reportedBy");
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Don't allow user to chat with themselves
    if (item.reportedBy._id.toString() === userId) {
      return res.status(400).json({ success: false, message: "Cannot chat with yourself" });
    }

    let conversation = await Conversation.findOne({
      itemId,
      participants: { $all: [userId, item.reportedBy._id] },
    }).populate("participants", "name email").populate("itemId", "title type");

    if (!conversation) {
      conversation = new Conversation({
        itemId,
        participants: [userId, item.reportedBy._id],
      });
      await conversation.save();
      await conversation.populate("participants", "name email");
      await conversation.populate("itemId", "title type");
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Chat creation error:', error);
    res.status(500).json({ success: false, message: "Failed to create conversation" });
  }
};

const getUserConversations = async (req, res) => {
  try {
    const userId = req.std.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email")
      .populate("itemId", "title type")
      .populate("lastMessage")
      .sort({ lastMessageTime: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: "Failed to load conversations" });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.std.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: "Failed to load messages" });
  }
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  getConversationMessages,
};