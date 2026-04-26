# 🚀 Deployment Guide

## ✅ Configuration Complete!

All deployment files have been created and committed to git.

---

## 📦 Next Steps to Deploy

### 1️⃣ Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/funpark.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Deploy Backend on Render (FREE)

1. Go to **[render.com](https://render.com)** and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `funpark-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `https://funpark.vercel.app`
6. Click **"Create Web Service"**
7. Wait 2-3 minutes for deployment
8. **Copy your Render URL** (e.g., `https://funpark-api.onrender.com`)

---

### 3️⃣ Update Frontend with Backend URL

```bash
# Edit client/src/environments/environment.prod.ts
# Replace 'https://funpark-api.onrender.com/api' with YOUR actual Render URL
```

Then commit:
```bash
git add client/src/environments/environment.prod.ts
git commit -m "Update production API URL"
git push
```

---

### 4️⃣ Deploy Frontend on Vercel (FREE)

1. Go to **[vercel.com](https://vercel.com)** and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Angular`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/funpark-client`
5. Click **"Deploy"**
6. Wait 1-2 minutes for deployment
7. **Copy your Vercel URL** (e.g., `https://funpark.vercel.app`)

---

### 5️⃣ Update Backend CORS (if needed)

If your Vercel URL is different from `https://funpark.vercel.app`:

1. Go to Render dashboard → Your service → Environment
2. Update `CORS_ORIGIN` with your actual Vercel URL
3. Save and redeploy

---

## 🎉 Done!

Your app is now live:
- **Frontend**: Your Vercel URL
- **Backend**: Your Render URL

---

## 🔄 Future Updates

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push
```

Both Vercel and Render will auto-deploy on push!

---

## 💡 Important Notes

- **Render Free Tier**: Spins down after 15 minutes of inactivity (first request may be slow)
- **Data Persistence**: CSV files persist on Render's free tier
- **Custom Domain**: Both platforms support custom domains (optional)
- **Monitoring**: Check logs in Render/Vercel dashboards

---

## 🆘 Troubleshooting

**CORS Errors?**
- Verify CORS_ORIGIN in Render matches your Vercel URL

**API Not Working?**
- Check Render logs for errors
- Verify environment variables are set

**Build Failures?**
- Check build logs in Vercel/Render
- Ensure all dependencies are in package.json

---

**Total Cost**: $0/month  
**Total Time**: ~15 minutes  
**Auto-Deploy**: ✅ Enabled
