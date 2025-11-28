# 🚀 DEPLOYMENT CHECKLIST - CampusFound

## PRE-DEPLOYMENT REQUIREMENTS

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create a new cluster (Free M0 tier is fine for start)
- [ ] Whitelist all IPs (0.0.0.0/0) for production access
- [ ] Create database user with read/write permissions
- [ ] Get connection string (format: mongodb+srv://username:password@cluster.mongodb.net/DatabaseName)

### 2. Cloudinary Setup
- [ ] Create Cloudinary account at https://cloudinary.com
- [ ] Get Cloud Name, API Key, and API Secret from dashboard
- [ ] Note: Free tier allows 25GB storage and 25GB bandwidth/month

### 3. Hugging Face Setup (Optional - for AI image search)
- [ ] Create account at https://huggingface.co
- [ ] Generate API token from Settings > Access Tokens
- [ ] Note: Free tier has rate limits but works for testing

---

## BACKEND DEPLOYMENT (Render.com)

### Step 1: Prepare Backend
```bash
cd backend
npm install
```

### Step 2: Create Render Account
1. Go to https://render.com and sign up
2. Connect your GitHub account
3. Push your code to GitHub first

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: campusfound-api (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=3000
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/LostNFound
JWT_SECRET=<generate-with-command-below>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
HF_TOKEN=your_huggingface_token
FRONTEND_URL=https://your-app.vercel.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Copy your backend URL (e.g., https://campusfound-api.onrender.com)

---

## FRONTEND DEPLOYMENT (Vercel)

### Step 1: Prepare Frontend
```bash
cd frontend
npm install
```

### Step 2: Create Vercel Account
1. Go to https://vercel.com and sign up
2. Install Vercel CLI: `npm install -g vercel`

### Step 3: Configure Environment Variables
Create `.env.production` file:
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

### Step 4: Deploy via Vercel CLI
```bash
cd frontend
vercel login
vercel --prod
```

OR via Vercel Dashboard:
1. Click "Add New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
4. Add environment variables from Step 3
5. Click "Deploy"

### Step 5: Get Deployment URL
- Copy your Vercel URL (e.g., https://campusfound.vercel.app)
- Update `FRONTEND_URL` in Render backend environment variables
- Redeploy backend on Render

---

## POST-DEPLOYMENT SETUP

### 1. Make Yourself Admin
Connect to MongoDB Atlas:
1. Go to MongoDB Atlas → Clusters → Browse Collections
2. Find your database → `students` collection
3. Find your user document by email
4. Edit document and add: `"role": "admin"`
5. Save

OR use the makeAdmin script:
```bash
# On your local machine with backend code
cd backend
node makeAdmin.js your-email@university.edu
```

### 2. Test Critical Features
- [ ] User registration works
- [ ] User login works
- [ ] Report lost item with image upload
- [ ] Report found item with image upload
- [ ] Images display correctly (Cloudinary URLs)
- [ ] Admin can approve/reject items
- [ ] Chat system works
- [ ] AI image search works
- [ ] Mobile responsive design works

### 3. Monitor Performance
- [ ] Check Render logs for errors
- [ ] Check Vercel deployment logs
- [ ] Monitor MongoDB Atlas metrics
- [ ] Check Cloudinary usage

---

## TROUBLESHOOTING

### Backend Issues
**Problem**: 502 Bad Gateway on Render
- **Solution**: Check Render logs, ensure all env vars are set, restart service

**Problem**: Database connection failed
- **Solution**: Verify DB_URI, check MongoDB Atlas IP whitelist (use 0.0.0.0/0)

**Problem**: Images not uploading
- **Solution**: Verify Cloudinary credentials, check Render logs for errors

### Frontend Issues
**Problem**: API calls failing (CORS errors)
- **Solution**: Ensure FRONTEND_URL is set correctly in backend env vars

**Problem**: Socket.IO not connecting
- **Solution**: Verify VITE_SOCKET_URL matches backend URL

**Problem**: Images not displaying
- **Solution**: Check browser console, verify Cloudinary URLs are accessible

### Performance Issues
**Problem**: Slow response times
- **Solution**: Upgrade Render instance, enable caching, optimize database queries

**Problem**: Render free tier sleeping
- **Solution**: Upgrade to paid tier OR use a service like UptimeRobot to ping every 5 minutes

---

## SECURITY CHECKLIST

- [x] JWT secrets are strong and unique
- [x] Passwords hashed with bcrypt (12 rounds)
- [x] MongoDB sanitization enabled
- [x] Helmet.js security headers enabled
- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] Input validation on all routes
- [x] httpOnly cookies for tokens
- [x] Environment variables not committed to Git
- [x] Error messages don't expose sensitive info

---

## SCALING CONSIDERATIONS

### When you reach 1000+ users:
1. **Upgrade Render Instance**: Move from free to paid tier
2. **Add Redis**: For caching and session management
3. **CDN**: Use Cloudinary's CDN for faster image delivery
4. **Database Indexing**: Add indexes on frequently queried fields
5. **Load Balancing**: Consider multiple Render instances
6. **Monitoring**: Add Sentry for error tracking
7. **Analytics**: Add Google Analytics or Mixpanel

---

## MAINTENANCE

### Weekly Tasks
- Check error logs on Render
- Monitor Cloudinary storage usage
- Review MongoDB Atlas performance metrics

### Monthly Tasks
- Update npm dependencies: `npm update`
- Review and optimize slow database queries
- Check for security vulnerabilities: `npm audit`

### Quarterly Tasks
- Review and optimize Cloudinary storage (delete unused images)
- Analyze user feedback and add features
- Performance testing and optimization

---

## SUPPORT & RESOURCES

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Cloudinary**: https://cloudinary.com/documentation

---

## ONE-LINE DEPLOY COMMAND

After initial setup, redeploy with:
```bash
# Frontend
cd frontend && vercel --prod

# Backend (auto-deploys on git push if connected to GitHub)
git add . && git commit -m "Update" && git push origin main
```

---

## ESTIMATED COSTS (Monthly)

- **MongoDB Atlas**: $0 (Free M0 tier, 512MB storage)
- **Cloudinary**: $0 (Free tier, 25GB storage)
- **Render**: $0 (Free tier) OR $7/month (Starter)
- **Vercel**: $0 (Hobby tier, unlimited bandwidth)
- **Hugging Face**: $0 (Free tier with rate limits)

**Total**: $0-7/month for up to 1000 users

---

## READY TO DEPLOY? ✅

Run this final check:
```bash
# Backend
cd backend
npm install
npm start  # Should start without errors

# Frontend
cd frontend
npm install
npm run build  # Should build without errors
npm run preview  # Test production build locally
```

If all checks pass, you're ready to deploy! 🚀
