# 🚀 Deployment Guide - Railway/Render + Vercel

## Part 1A: Deploy Backend to Railway (5 minutes) ⭐ RECOMMENDED

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your `campusfound` repository
4. Railway will detect it's a Node.js app

### Step 3: Configure Service
1. Click on the deployed service
2. Go to **"Settings"** tab
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `npm start`
5. Railway auto-detects build command

### Step 4: Add Environment Variables
1. Go to **"Variables"** tab
2. Click **"+ New Variable"**
3. Add these one by one:

```
NODE_ENV=production
PORT=3000
DB_URI=mongodb+srv://sibat:sibat123@cluster0.te6hv1r.mongodb.net/LostNFound
JWT_SECRET=8f9a2c5d7e1b3f6g9h4j1k8m5n2p7q0r3s6t9u1v4w8x0y5z2a7b9c1d3e6f
CLOUDINARY_CLOUD_NAME=da3i4l1st
CLOUDINARY_API_KEY=167141761881629
CLOUDINARY_API_SECRET=6JnnyUxbq7Mdj0wBFaP4rqBxJnw
HF_TOKEN=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
FRONTEND_URL=https://your-app.vercel.app
```

**Note:** You'll update `FRONTEND_URL` after deploying frontend

### Step 5: Generate Domain
1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy your URL (e.g., `https://campusfound-production.up.railway.app`)

### Step 6: Deploy
- Railway auto-deploys immediately
- Wait 2-3 minutes
- Check **"Deployments"** tab for status

---

## Part 1B: Deploy Backend to Render (10 minutes) - Alternative

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `campusfound` repository

### Step 3: Configure Service
Fill in these settings:

- **Name**: `campusfound-api` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (or paid for better performance)

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

```
NODE_ENV=production
PORT=3000
DB_URI=mongodb+srv://sibat:sibat123@cluster0.te6hv1r.mongodb.net/LostNFound
JWT_SECRET=8f9a2c5d7e1b3f6g9h4j1k8m5n2p7q0r3s6t9u1v4w8x0y5z2a7b9c1d3e6f
CLOUDINARY_CLOUD_NAME=da3i4l1st
CLOUDINARY_API_KEY=167141761881629
CLOUDINARY_API_SECRET=6JnnyUxbq7Mdj0wBFaP4rqBxJnw
HF_TOKEN=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
FRONTEND_URL=https://your-app.vercel.app
```

**Note:** You'll update `FRONTEND_URL` after deploying frontend

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your backend URL (e.g., `https://campusfound-api.onrender.com`)

---

---

## Part 2: Deploy Frontend to Vercel (5 minutes)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your `campusfound` repository
3. Click **"Import"**

### Step 3: Configure Project
Fill in these settings:

- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

**Replace with your actual Railway/Render backend URL!**

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Copy your frontend URL (e.g., `https://campusfound.vercel.app`)

---

## Part 3: Connect Frontend & Backend

### Update Backend Environment Variable

**For Railway:**
1. Go to Railway dashboard
2. Click your project
3. Go to **"Variables"** tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Railway auto-redeploys (1-2 minutes)

**For Render:**
1. Go to Render dashboard
2. Click your web service
3. Go to **"Environment"**
4. Update `FRONTEND_URL` with your Vercel URL
5. Click **"Save Changes"**
6. Service will auto-redeploy (2-3 minutes)

---

## Part 4: Make Yourself Admin

### Option 1: MongoDB Atlas (Easiest)
1. Go to https://cloud.mongodb.com
2. Click **"Browse Collections"**
3. Find `students` collection
4. Find your user by email
5. Click **"Edit"**
6. Add: `"role": "admin"`
7. Click **"Update"**

### Option 2: Using Backend Shell

**Railway:**
- Railway doesn't have built-in shell
- Use MongoDB Atlas method (Option 1)

**Render:**
1. Go to Render dashboard → Your service
2. Click **"Shell"** tab
3. Wait for shell to load
4. Run: `node -e "require('./db/db').connectDb().then(async()=>{const{student}=require('./models/stdModel');await student.updateOne({email:'YOUR_EMAIL'},{role:'admin'});console.log('Done');process.exit()})"`
5. Replace `YOUR_EMAIL` with your email

---

## Part 5: Test Your Deployment

### Test Backend
Visit: `https://your-backend-url.railway.app/health`

Should see: `{"status":"ok","timestamp":"..."}`

### Test Frontend
1. Visit your Vercel URL
2. Register a new account
3. Login
4. Report a test item
5. Go to `/admin` (if you're admin)
6. Approve the item
7. Test chat feature

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app (or .onrender.com)

---

## 📊 Free Tier Limits

### Railway Free Tier ⭐
- ✅ $5 free credit/month
- ✅ No sleep (always on!)
- ✅ Fast deployments (1-2 min)
- ✅ 500 hours execution time
- 💡 Upgrade with credit card for more

### Render Free Tier
- ✅ 750 hours/month
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Cold start takes 30-60 seconds
- 💡 Upgrade to $7/month for always-on

### Vercel Free Tier
- ✅ Unlimited bandwidth
- ✅ 100 GB-hours/month
- ✅ Always fast (no sleep)

### MongoDB Atlas Free Tier
- ✅ 512 MB storage
- ✅ Shared cluster
- ✅ Good for 1000+ users

### Cloudinary Free Tier
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ Good for 5000+ images

---

## 🔄 Update Your Deployment

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
```
- Railway auto-deploys in 1-2 minutes
- Render auto-deploys in 2-3 minutes

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel auto-deploys in 1-2 minutes

---

## 🆘 Troubleshooting

### Backend not starting
- Check Railway/Render logs for errors
- Verify all environment variables are set
- Check MongoDB Atlas IP whitelist (use 0.0.0.0/0)

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check `FRONTEND_URL` matches Vercel URL
- Check browser console for CORS errors

### Images not uploading
- Verify Cloudinary credentials
- Check backend logs for upload errors

### Database connection failed
- Check `DB_URI` is correct
- Verify MongoDB Atlas allows connections from anywhere
- Check database user has read/write permissions

---

## 💡 Pro Tips

1. **Monitor Logs**: Check Railway/Render logs regularly for errors
2. **Railway is faster**: No sleep, faster deploys than Render free tier
3. **Use Custom Domain**: Add your own domain in Vercel settings
4. **Enable Analytics**: Turn on Vercel Analytics for free
5. **Backup Database**: MongoDB Atlas has automatic backups

---

## 🎯 Next Steps

- [ ] Test all features on production
- [ ] Share app URL with students
- [ ] Monitor usage and errors
- [ ] Monitor Railway credit usage ($5/month free)
- [ ] Consider upgrading if you exceed free tier
- [ ] Add custom domain (optional)

---

**Need help?** Check Render logs and Vercel deployment logs for specific errors.
