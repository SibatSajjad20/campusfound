# 🧹 Clean Database & Setup Admin

## Step-by-Step Guide to Clean Everything and Create Fresh Admin

### Step 1: Clean All Development Data

This will delete:
- ✅ All items from database
- ✅ All users from database
- ✅ All chat conversations and messages
- ✅ All images from Cloudinary

```bash
cd backend
node cleanDatabase.js
```

**Expected Output:**
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Deleting all images from Cloudinary...
✅ Deleted X images from Cloudinary

🗑️  Cleaning database collections...
✅ Deleted X items
✅ Deleted X students
✅ Deleted X conversations
✅ Deleted X messages

✨ Database cleaned successfully!
```

### Step 2: Create Admin Account

This will create a single admin user that you'll use to manage the platform.

```bash
node createAdmin.js
```

**You'll be prompted to enter:**
- Admin name (e.g., "John Doe")
- Admin email (e.g., "admin@university.edu")
- Admin password (minimum 6 characters)

**Expected Output:**
```
📝 Create Admin Account

Enter admin name: John Doe
Enter admin email: admin@university.edu
Enter admin password: ******

🔐 Hashing password...
👤 Creating admin account...

✅ Admin account created successfully!

📋 Admin Details:
   Name: John Doe
   Email: admin@university.edu
   Role: admin
   ID: 507f1f77bcf86cd799439011

🚀 You can now login with these credentials!
```

### Step 3: Clean Local Uploads Folder (Optional)

If you have local test images in the uploads folder:

**Windows:**
```bash
cd backend
del /Q uploads\*.*
```

**Mac/Linux:**
```bash
cd backend
rm -f uploads/*
```

### Step 4: Verify Everything is Clean

1. **Check MongoDB Atlas:**
   - Go to MongoDB Atlas → Browse Collections
   - Verify all collections are empty except `students` (should have 1 admin)

2. **Check Cloudinary:**
   - Go to Cloudinary Dashboard → Media Library
   - Verify `lostnfound` folder is empty

3. **Test Admin Login:**
   - Start your backend: `npm run dev`
   - Start your frontend: `cd ../frontend && npm run dev`
   - Go to http://localhost:5173/login
   - Login with your admin credentials
   - Verify you can access Admin Dashboard at `/admin`

### Step 5: Ready for Production!

Now your database is clean and you have a single admin account. You're ready to:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Production ready - clean database"
git push origin main
```

2. **Deploy to Render & Vercel** (follow DEPLOYMENT_CHECKLIST.md)

3. **After deployment, create admin on production:**
   - SSH into Render or use Render Shell
   - Run: `node createAdmin.js`
   - OR manually add role: "admin" in MongoDB Atlas

---

## Quick Commands Reference

```bash
# Clean everything
cd backend && node cleanDatabase.js

# Create admin
node createAdmin.js

# Clean local uploads
del /Q uploads\*.*  # Windows
rm -f uploads/*     # Mac/Linux

# Start fresh
npm run dev
```

---

## Troubleshooting

**Error: Cannot connect to MongoDB**
- Check your DB_URI in .env file
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0

**Error: Cloudinary authentication failed**
- Verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env

**Admin creation failed - user exists**
- Run cleanDatabase.js again to remove all users
- Or use a different email address

---

## Important Notes

⚠️ **WARNING**: `cleanDatabase.js` will permanently delete ALL data. Make sure you want to do this!

✅ **Safe to run**: These scripts only affect your database and Cloudinary, not your code.

💡 **Tip**: Save your admin credentials in a secure password manager!

---

## After Cleaning Checklist

- [ ] Database cleaned (all collections empty)
- [ ] Cloudinary cleaned (lostnfound folder empty)
- [ ] Admin account created
- [ ] Admin login tested locally
- [ ] Ready to push to GitHub
- [ ] Ready to deploy to production
