# 🚀 CampusFound - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies (2 min)
```bash
# Backend
cd backend
npm install

# Frontend  
cd frontend
npm install
```

### 2. Environment Setup (1 min)
```bash
# backend/.env
DB_URI=mongodb://localhost:27017/campusfound
JWT_SECRET=your-secret-key-min-32-characters
PORT=3000
NODE_ENV=development

# frontend/.env
VITE_API_URL=http://localhost:3000/api
```

### 3. Database Migration (30 sec)
```bash
cd backend
node migrateItems.js
```

### 4. Make Yourself Admin (30 sec)
```bash
node makeAdmin.js your-email@gmail.com
```

### 5. Start Servers (1 min)
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access App
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🎯 Test Checklist (5 min)

1. ✅ Register new account
2. ✅ Login
3. ✅ Report lost item (status: pending)
4. ✅ Logout
5. ✅ Login as admin
6. ✅ Go to /admin
7. ✅ Approve the item
8. ✅ Verify item is now visible to all users

---

## 🔑 Key Commands

### Make Admin
```bash
node makeAdmin.js email@example.com
```

### Migrate Database
```bash
node migrateItems.js
```

### Start Backend
```bash
cd backend && npm start
```

### Start Frontend
```bash
cd frontend && npm run dev
```

### Build for Production
```bash
cd frontend && npm run build
```

---

## 📋 Admin Actions

| Action | Route | Method |
|--------|-------|--------|
| Approve Item | `/api/items/:id/approve` | PATCH |
| Reject Item | `/api/items/:id/reject` | PATCH |
| Delete Item | `/api/items/:id` | DELETE |
| Resolve Item | `/api/items/:id/resolve` | PATCH |

---

## 🎨 Status Colors

- 🟠 **Pending** - Waiting admin approval
- 🟢 **Active** - Approved, visible to all
- 🔴 **Rejected** - Admin rejected
- ⚫ **Resolved** - Item found/returned

---

## 🔐 Security Features

✅ Rate Limiting (10 auth, 50 items per 15min)
✅ Input Validation (Joi)
✅ NoSQL Injection Protection
✅ JWT Expiration (1 day)
✅ Secure Cookies
✅ Image Size Limit (5MB)

---

## 📱 Mobile Optimization

✅ All buttons min 44px height
✅ Touch-friendly spacing
✅ Responsive design
✅ Lazy-loaded images

---

## 🐛 Common Issues

### "Rate limit exceeded"
Wait 15 minutes or adjust limits in `backend/middlewares/rateLimiter.js`

### "Admin access only"
Run: `node makeAdmin.js your-email@gmail.com`

### "Database connection failed"
Check MongoDB is running and DB_URI is correct

### Images not loading
Ensure `backend/uploads/` folder exists

---

## 📚 Documentation

- `PRODUCTION_READY_GUIDE.md` - Complete guide
- `ADMIN_SYSTEM_GUIDE.md` - Admin details
- `IMPLEMENTATION_SUMMARY.md` - All changes

---

## ✅ Production Checklist

Before deploying:
- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure CORS origins
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Create admin accounts
- [ ] Test all features
- [ ] Run security audit

---

## 🎉 You're Ready!

Your CampusFound app is production-ready. Deploy it and help students find their lost items!

**Need help?** Check the detailed guides in the project root.
