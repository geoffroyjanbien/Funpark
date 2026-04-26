# ✅ DEPLOYMENT CHECKLIST

## ✅ COMPLETED:
- [x] Created environment files
- [x] Updated CORS configuration
- [x] Created deployment configs (vercel.json, render.yaml)
- [x] Committed all changes to git
- [x] Pushed to GitHub: https://github.com/geoffroyjanbien/Funpark

---

## 🚀 MANUAL STEPS REQUIRED:

### Step 1: Deploy Backend on Render (5 minutes)

1. Open: **https://render.com**
2. Sign up/Login (use GitHub account for easy connection)
3. Click **"New +"** → **"Web Service"**
4. Select repository: **geoffroyjanbien/Funpark**
5. Fill in:
   ```
   Name: funpark-api
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```
6. Click **"Advanced"** → Add Environment Variables:
   ```
   NODE_ENV = production
   CORS_ORIGIN = https://funpark.vercel.app
   ```
7. Click **"Create Web Service"**
8. ⏳ Wait 2-3 minutes for deployment
9. ✅ **COPY YOUR RENDER URL** (looks like: https://funpark-api-xxxx.onrender.com)

---

### Step 2: Update Frontend with Your Render URL

Once you have your Render URL from Step 1:

**Option A: Update locally and push**
```bash
# Edit this file:
# client/src/environments/environment.prod.ts
# Change line 3 to your actual Render URL:
apiUrl: 'https://YOUR-ACTUAL-RENDER-URL.onrender.com/api'

# Then commit and push:
git add client/src/environments/environment.prod.ts
git commit -m "Update production API URL"
git push
```

**Option B: Update directly on GitHub**
- Go to: https://github.com/geoffroyjanbien/Funpark
- Navigate to: client/src/environments/environment.prod.ts
- Click "Edit" (pencil icon)
- Change the apiUrl to your Render URL
- Commit changes

---

### Step 3: Deploy Frontend on Vercel (3 minutes)

1. Open: **https://vercel.com**
2. Sign up/Login (use GitHub account)
3. Click **"Add New..."** → **"Project"**
4. Find and Import: **geoffroyjanbien/Funpark**
5. Configure:
   ```
   Framework Preset: Angular
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist/funpark-client
   ```
6. Click **"Deploy"**
7. ⏳ Wait 1-2 minutes
8. ✅ **YOUR APP IS LIVE!** Copy the Vercel URL

---

### Step 4: Update CORS (if Vercel URL is different)

If your Vercel URL is NOT `https://funpark.vercel.app`:

1. Go to Render Dashboard → Your Service
2. Click "Environment" tab
3. Update `CORS_ORIGIN` to your actual Vercel URL
4. Click "Save Changes"
5. Service will auto-redeploy

---

## 🎉 DEPLOYMENT COMPLETE!

**Your Live URLs:**
- Frontend: [Your Vercel URL]
- Backend: [Your Render URL]

**Auto-Deploy Enabled:** Any future `git push` will auto-deploy both services!

---

## 📊 What to Expect:

### First Deploy:
- Render: 2-3 minutes
- Vercel: 1-2 minutes
- Total: ~5 minutes

### Future Deploys:
- Automatic on every `git push`
- Takes 1-2 minutes

### Free Tier Limits:
- Render: Spins down after 15 min inactivity (first request may take 30s)
- Vercel: Always fast, no spin-down
- Both: Unlimited deploys

---

## 🆘 Troubleshooting:

**Render Build Fails?**
- Check logs in Render dashboard
- Ensure `server/package.json` has all dependencies

**Vercel Build Fails?**
- Check build logs
- Ensure Angular version compatibility

**CORS Errors?**
- Verify CORS_ORIGIN in Render matches your Vercel URL exactly
- Include `https://` in the URL

**API Not Responding?**
- Render free tier spins down - first request takes 30s
- Check Render logs for errors

**Data Not Persisting?**
- CSV files persist on Render free tier
- Check `server/data/` directory exists

---

## 🔄 Making Updates:

```bash
# Make your changes
git add .
git commit -m "Your update description"
git push

# Both services auto-deploy in 1-2 minutes!
```

---

**Repository:** https://github.com/geoffroyjanbien/Funpark
**Cost:** $0/month
**Time to Deploy:** ~10 minutes total
