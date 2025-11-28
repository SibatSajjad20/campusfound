const { Conversation, Message } = require("../models/chatModel");
const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      return next(new Error("No cookies provided"));
    }
    
    const tokenMatch = cookies.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    
    if (!token) {
      return next(new Error("No token in cookies"));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Authentication error: " + err.message));
  }
};

const handleConnection = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`User ${socket.userId} connected`);

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("send-message", async (data) => {
      try {
        const { conversationId, content } = data;

        // Verify user is part of conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(socket.userId)) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        // Create message
        const message = new Message({
          conversationId,
          sender: socket.userId,
          content,
        });
        await message.save();
        await message.populate("sender", "name");

        // Update conversation
        conversation.lastMessage = message._id;
        conversation.lastMessageTime = new Date();
        await conversation.save();

        // Emit to all users in conversation
        io.to(conversationId).emit("new-message", message);
      } catch (error) {
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });
};

module.exports = { handleConnection };