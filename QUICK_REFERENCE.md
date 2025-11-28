# 🚀 CampusFound - Quick Reference Card

## 📍 URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Base**: http://localhost:3000/api

## 🔑 Start Commands

### Windows (Easy Way)
```bash
# Double-click START.bat
```

### Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 📁 Key Files

### Configuration
- `backend/.env` - Backend config (PORT, DB_URI, JWT_SECRET)
- `frontend/.env` - Frontend config (VITE_API_URL)

### API
- `frontend/src/api/config.js` - Main API instance
- `frontend/src/api/chatApi.js` - Chat API

### Context
- `frontend/src/context/AuthContext.jsx` - Auth state
- `frontend/src/context/SocketContext.jsx` - Socket connection

### Main Pages
- `frontend/src/pages/Landing.tsx` - Landing page (/)
- `frontend/src/pages/Home.jsx` - Dashboard (/home)
- `frontend/src/pages/Login.jsx` - Login (/login)
- `frontend/src/pages/Register.jsx` - Register (/register)
- `frontend/src/pages/ReportItem.jsx` - Report items (/report)
- `frontend/src/pages/ItemDetail.jsx` - Item details (/item/:id)
- `frontend/src/pages/Search.jsx` - Search (/search)
- `frontend/src/pages/ImageSearch.jsx` - AI search (/image-search)
- `frontend/src/pages/Profile.jsx` - User profile (/profile)
- `frontend/src/pages/Chat.tsx` - Chat (/chat)

## 🛣️ Routes

### Public Routes
- `/` - Landing page
- `/login` - Login
- `/register` - Register

### Protected Routes (Require Login)
- `/home` - Dashboard
- `/report` - Report item
- `/item/:id` - Item details
- `/search` - Search items
- `/image-search` - AI image search
- `/profile` - User profile
- `/chat` - Chat

## 🔌 API Endpoints

### Auth
```
POST /api/auth/register - Register
POST /api/auth/login - Login
POST /api/auth/logout - Logout
```

### Items
```
GET  /api/items/all - All items
GET  /api/items/lost - Lost items
GET  /api/items/found - Found items
GET  /api/items/my-items - User's items
GET  /api/items/:id - Item by ID
POST /api/items/report - Report item (with image)
POST /api/items/search-by-image - AI search
GET  /api/items/search - Text search
PATCH /api/items/:id/resolve - Mark resolved
```

### Chat
```
GET /api/chat/conversations - User conversations
GET /api/chat/conversations/:itemId - Get/create conversation
GET /api/chat/messages/:conversationId - Get messages
```

## 🎯 Features Checklist

- ✅ User registration & login
- ✅ Report lost items with photos
- ✅ Report found items with photos
- ✅ View all items
- ✅ Search by text
- ✅ Filter by category/type
- ✅ AI image search (perceptual hashing)
- ✅ Real-time chat (Socket.IO)
- ✅ User profile
- ✅ Mark items as resolved
- ✅ Responsive design
- ✅ Toast notifications

## 🐛 Common Issues

### Backend won't start
```bash
cd backend
npm install
# Check if port 3000 is free
npm start
```

### Frontend won't start
```bash
cd frontend
npm install
# Check if port 5173 is free
npm run dev
```

### Images not showing
- Check `backend/uploads/` folder exists
- Verify backend serves static files: `app.use('/uploads', express.static('uploads'))`

### Chat not working
- Check Socket.IO connection in browser console
- Verify backend Socket.IO is running
- Check CORS settings

### 401 Errors
- Clear localStorage
- Login again
- Check token in localStorage

## 🔍 Debug Tips

### Check Backend
```bash
# Backend console should show:
# - "server is connected"
# - MongoDB connection success
# - Socket.IO initialized
```

### Check Frontend
```bash
# Browser console should show:
# - "Connected to server" (Socket.IO)
# - No CORS errors
# - API calls returning data
```

### Check Database
- MongoDB Atlas dashboard
- Check collections: users, items, chats
- Verify data is being saved

## 📦 Dependencies

### Backend
- express, mongoose, socket.io
- jsonwebtoken, bcrypt, cookie-parser
- multer, imghash, cors

### Frontend
- react, react-router-dom
- axios, socket.io-client
- tailwindcss, framer-motion
- react-toastify

## 🎨 Color Scheme
- Primary: `#2E073F` (Dark Purple)
- Secondary: `#AD49E1` (Light Purple)
- Success: Green
- Error: Red
- Warning: Orange

## 👨💻 Developer
**Sibat Sajjad**
- 📧 sajjadsibat33@gmail.com
- 🔗 [LinkedIn](https://www.linkedin.com/in/sibat-sajjad-a096731a9)
- 💻 [GitHub](https://github.com/SibatSajjad20)

## 📝 Notes
- All passwords are hashed with bcrypt
- JWT tokens expire (check JWT_SECRET in .env)
- Images stored in `backend/uploads/`
- Socket.IO uses same port as backend (3000)
- Frontend uses Vite for fast development

---

**Everything is connected and ready to use! 🎉**
