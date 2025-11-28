# 🎓 CampusFound - AI-Powered Lost & Found Platform

A modern, AI-powered lost and found system designed for universities with 5000+ students. Built with MERN stack, featuring real-time chat, AI image search, and admin approval workflows.

![CampusFound](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18+-green)

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - JWT-based auth with httpOnly cookies
- 📸 **Image Upload** - Cloudinary integration for reliable image storage
- 🤖 **AI Image Search** - Find similar items using perceptual hashing and CLIP embeddings
- 💬 **Real-time Chat** - Socket.IO powered messaging between users
- 👨‍💼 **Admin Dashboard** - Approve/reject/manage all reported items
- 🔔 **Status Tracking** - Pending → Active → Resolved workflow
- 📱 **Mobile Responsive** - Beautiful UI that works on all devices
- 🎨 **Modern UI** - Framer Motion animations, Tailwind CSS styling

### Security Features
- ✅ Helmet.js security headers
- ✅ MongoDB sanitization (NoSQL injection prevention)
- ✅ Rate limiting on all routes
- ✅ Input validation with Joi
- ✅ Bcrypt password hashing (12 rounds)
- ✅ CORS protection
- ✅ XSS protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudinary account
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd LOSTNFOUND
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

4. **Access the app**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + Cloudinary
- **Real-time**: Socket.IO
- **Security**: Helmet, express-mongo-sanitize, express-rate-limit
- **AI**: Hugging Face Inference API, Sharp (image processing)

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **HTTP Client**: Axios + axios-retry
- **Routing**: React Router v7
- **State**: Context API
- **Icons**: Lucide React

## 🗂️ Project Structure

```
LOSTNFOUND/
├── backend/
│   ├── config/          # Cloudinary config
│   ├── controllers/     # Route controllers
│   ├── db/              # Database connection
│   ├── middlewares/     # Auth, rate limiting, upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── socket/          # Socket.IO handlers
│   ├── utils/           # Image search utilities
│   ├── validation/      # Joi schemas
│   └── index.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # API configuration
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React contexts
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utility functions
│   │   └── App.tsx      # Main app component
│   └── index.html       # HTML template
└── DEPLOYMENT_CHECKLIST.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
DB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
HF_TOKEN=your_huggingface_token
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

## 👨‍💼 Making Yourself Admin

### Method 1: MongoDB Atlas Dashboard
1. Go to MongoDB Atlas → Browse Collections
2. Find `students` collection
3. Locate your user by email
4. Edit document and add: `"role": "admin"`

### Method 2: Using makeAdmin Script
```bash
cd backend
node makeAdmin.js your-email@university.edu
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Items
- `GET /api/items/all` - Get all items (filtered by status)
- `GET /api/items/lost` - Get lost items
- `GET /api/items/found` - Get found items
- `POST /api/items/report` - Report new item
- `POST /api/items/search-by-image` - AI image search
- `PATCH /api/items/:id/approve` - Approve item (admin)
- `PATCH /api/items/:id/reject` - Reject item (admin)
- `PATCH /api/items/:id/resolve` - Mark as resolved
- `DELETE /api/items/:id` - Delete item (admin)

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/conversations/:id` - Get conversation messages
- `POST /api/chat/conversations` - Create/get conversation
- `POST /api/chat/messages` - Send message

## 🎯 User Flows

### Report Lost Item
1. User clicks "Report Lost Item"
2. Fills form (title, description, category, location, optional image)
3. Item created with status "pending"
4. Admin reviews and approves/rejects
5. If approved, status changes to "active" and visible to all users

### Find Your Lost Item
1. User searches by text or uploads image for AI search
2. Views matching items
3. Clicks item to see details
4. Starts chat with person who found it
5. Marks item as "resolved" when recovered

### Admin Workflow
1. Admin logs in and goes to Admin Dashboard
2. Sees all items (pending, active, rejected, resolved)
3. Reviews pending items
4. Approves legitimate items, rejects spam
5. Can delete any item if needed

## 🔒 Security Best Practices

1. **Never commit .env files** - Use .env.example as template
2. **Use strong JWT secrets** - Generate with crypto.randomBytes(64)
3. **Keep dependencies updated** - Run `npm audit` regularly
4. **Monitor logs** - Check Render/Vercel logs for suspicious activity
5. **Rate limiting** - Already configured, adjust if needed
6. **Input validation** - All inputs validated with Joi schemas

## 📤 Push to GitHub

### Quick Commands
```bash
cd LOSTNFOUND
git init
git add .
git commit -m "Initial commit: CampusFound Platform"
git remote add origin https://github.com/YOUR_USERNAME/campusfound.git
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your GitHub username!

### What's Included
- ✅ `.gitignore` configured (excludes .env, node_modules, uploads)
- ✅ `.env.example` files for both backend and frontend
- ✅ All source code and documentation

### What's Excluded
- ❌ `.env` files (secrets)
- ❌ `node_modules/` folders
- ❌ `uploads/` folder contents

---

## 🚀 Deployment

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete deployment guide.

**Quick Deploy:**
1. Push code to GitHub (see above)
2. Deploy backend to Render.com
3. Deploy frontend to Vercel
4. Configure environment variables
5. Make yourself admin
6. Test all features

## 📈 Performance Optimization

- ✅ Compression middleware enabled
- ✅ Image optimization via Cloudinary
- ✅ Database indexing on frequently queried fields
- ✅ Axios retry logic for failed requests
- ✅ Socket.IO reconnection handling
- ✅ React lazy loading for routes (can be added)

## 🐛 Troubleshooting

### Common Issues

**Images not uploading**
- Check Cloudinary credentials in .env
- Verify uploads folder exists and is writable
- Check backend logs for errors

**Socket.IO not connecting**
- Verify VITE_SOCKET_URL matches backend URL
- Check CORS configuration
- Ensure backend is running

**Database connection failed**
- Verify DB_URI format
- Check MongoDB Atlas IP whitelist (use 0.0.0.0/0)
- Ensure database user has correct permissions

**CORS errors**
- Add frontend URL to FRONTEND_URL env var
- Restart backend after env var changes
- Check browser console for specific error

## 📝 License

MIT License - feel free to use this project for your university!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

For issues and questions:
- Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- Review error logs on Render/Vercel
- Check MongoDB Atlas metrics

## 🎉 Acknowledgments

- Built with ❤️ for university students
- AI image search powered by Hugging Face
- Icons by Lucide React
- Animations by Framer Motion

---

**Ready to deploy?** Follow the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) guide!
