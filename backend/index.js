require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require('helmet');
const compression = require('compression');
const { authRouter } = require("./routes/authRoutes");
const { connectDb } = require("./db/db");
const cookieParser = require('cookie-parser');
const { itemRouter } = require("./routes/itemRoutes");
const { chatRouter } = require("./routes/chatRoutes");
const { handleConnection } = require("./socket/socketHandler");
const cors = require("cors");

// Environment validation
const requiredEnvVars = ['DB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

// Trust proxy for production (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Serve uploaded images (fallback for old images)
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);
app.use("/api/chat", chatRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, msg: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(statusCode).json({ success: false, msg: message });
});

// Initialize Socket.IO
handleConnection(io);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

server.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  } catch (err) {
    console.error(`❌ Database connection failed:`, err.message);
    process.exit(1);
  }
});
