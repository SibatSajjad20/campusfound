const express = require("express");
const {
  getOrCreateConversation,
  getUserConversations,
  getConversationMessages,
} = require("../controllers/chatController");
const { protectRoute } = require("../middlewares/authmw");

const chatRouter = express.Router();

chatRouter.get("/conversations", protectRoute, getUserConversations);
chatRouter.get("/conversations/:itemId", protectRoute, getOrCreateConversation);
chatRouter.get("/messages/:conversationId", protectRoute, getConversationMessages);

module.exports = { chatRouter };