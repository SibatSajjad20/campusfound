# CampusFound - Complete Setup Guide

## 🚀 Full Stack Lost & Found Platform with AI Image Recognition

### Project Overview
CampusFound is a modern lost and found platform featuring:
- AI-powered image matching using perceptual hashing
- Real-time chat with Socket.IO
- JWT authentication
- Responsive React frontend with Tailwind CSS
- Node.js/Express backend with MongoDB

---

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The `.env` file is already configured:
```env
PORT=3000
DB_URI=mongodb+srv://sibat:sibat123@cluster0.te6hv1r.mongodb.net/LostNFound?appName=Cluster0
JWT_SECRET="secret@123"
```

### 4. Start Backend Server
```bash
npm start
```

Backend will run on: **http://localhost:3000**

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
The `.env` file is already configured:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Items
- `GET /api/items/all` - Get all items
- `GET /api/items/lost` - Get lost items
- `GET /api/items/found` - Get found items
- `GET /api/items/my-items` - Get user's items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items/report` - Report new item (with image upload)
- `POST /api/items/search-by-image` - AI image search
- `GET /api/items/search` - Text search with filters
- `PATCH /api/items/:id/resolve` - Mark item as resolved

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/conversations/:itemId` - Get/create conversation for item
- `GET /api/chat/messages/:conversationId` - Get messages

### Socket.IO Events
- `join-conversation` - Join chat room
- `send-message` - Send message
- `new-message` - Receive message

---

## 🎯 Features

### 1. User Authentication
- Secure JWT-based authentication
- Cookie-based session management
- Protected routes

### 2. Item Management
- Report lost items with photos
- Report found items with photos
- View all items with filters
- Search by text (title, description, location)
- Category and type filters

### 3. AI Image Search
- Upload image to find similar items
- Perceptual hashing algorithm
- Similarity percentage matching
- Works across different lighting/angles

### 4. Real-time Chat
- Socket.IO powered messaging
- Chat about specific items
- Real-time message delivery
- Conversation history

### 5. User Profile
- View reported items
- Track lost and found items
- Item status management

---

## 🗂️ Project Structure

```
LOSTNFOUND/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middlewares/     # Auth & upload middleware
│   ├── socket/          # Socket.IO handlers
│   ├── uploads/         # Uploaded images
│   └── index.js         # Server entry point
│
└── frontend/
    ├── src/
    │   ├── api/         # API configuration
    │   ├── components/  # React components
    │   ├── context/     # Auth & Socket context
    │   ├── pages/       # Page components
    │   └── App.tsx      # Main app component
    └── package.json
```

---

## 🧪 Testing the Application

### 1. Register a New User
- Go to http://localhost:5173
- Click "Register"
- Fill in name, email, password
- Submit

### 2. Login
- Use registered credentials
- You'll be redirected to home page

### 3. Report a Lost Item
- Click "Report Lost Item"
- Fill in details
- Upload image (optional)
- Submit

### 4. Report a Found Item
- Click "Report Found Item"
- Fill in details
- Upload image (optional)
- Submit

### 5. Search Items
- Use search bar on home page
- Or use filters in search page
- Try image search with uploaded photo

### 6. Chat with Users
- Click on any item
- Click "Chat with [user]"
- Send messages in real-time

---

## 🔍 AI Image Matching

The platform uses **perceptual hashing** (pHash) to match images:

1. When an image is uploaded, it's converted to a hash
2. Hash represents visual features (not exact pixels)
3. Similar images have similar hashes
4. Hamming distance calculates similarity
5. Results sorted by similarity percentage

**Benefits:**
- Works with different image sizes
- Handles lighting variations
- Recognizes rotated images
- Fast comparison (milliseconds)

---

## 🛠️ Technologies Used

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Socket.IO Client
- Axios
- React Toastify

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Multer (file upload)
- imghash (perceptual hashing)
- bcrypt

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct
- Ensure port 3000 is not in use
- Run `npm install` again

### Frontend won't start
- Check if backend is running
- Ensure port 5173 is not in use
- Clear node_modules and reinstall

### Images not displaying
- Check uploads folder exists in backend
- Verify image paths in database
- Ensure backend serves static files

### Chat not working
- Check Socket.IO connection in browser console
- Verify backend Socket.IO is initialized
- Check CORS settings

---

## 📝 Default Test Credentials

You can create your own account or use these if available:
- Email: test@example.com
- Password: test123

---

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy backend code
3. Update frontend API URL

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy dist folder
3. Set environment variables

---

## 👨‍💻 Developer

**Sibat Sajjad**
- LinkedIn: [linkedin.com/in/sibat-sajjad-a096731a9](https://www.linkedin.com/in/sibat-sajjad-a096731a9)
- GitHub: [github.com/SibatSajjad20](https://github.com/SibatSajjad20)
- Email: sajjadsibat33@gmail.com

---

## 📄 License

This project is built for educational purposes.

---

## 🎉 Enjoy Using CampusFound!

If you encounter any issues, check the console logs in both frontend and backend for detailed error messages.
