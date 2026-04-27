# 🌐 Deployment URLs

## Live Application URLs

### Frontend (Vercel)
```
https://funpark-57exoneln-geoffroyjanbien-4204s-projects.vercel.app
```

### Backend (Render)
```
https://funpark-api.onrender.com
```

### API Endpoint
```
https://funpark-api.onrender.com/api
```

---

## ✅ Configuration Checklist

### Render Environment Variables
Make sure these are set in your Render dashboard:

```
NODE_ENV = production
CORS_ORIGIN = https://funpark-57exoneln-geoffroyjanbien-4204s-projects.vercel.app
```

**To verify/update:**
1. Go to: https://dashboard.render.com
2. Select: **funpark-api** service
3. Click: **Environment** tab
4. Verify `CORS_ORIGIN` matches your Vercel URL exactly
5. If changed, click **Save Changes** (auto-redeploys)

---

## 🧪 Testing Your Deployment

### 1. Test Backend Health
Open in browser:
```
https://funpark-api.onrender.com/health
```
Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Test Frontend
Open in browser:
```
https://funpark-57exoneln-geoffroyjanbien-4204s-projects.vercel.app/dashboard
```

### 3. Test API Connection
- Open the frontend URL
- Navigate to Revenue, Expenses, or any data page
- If data loads → ✅ Everything works!
- If CORS error → Check Render environment variables

---

## 🔄 Future Updates

Any `git push` will automatically deploy to both:
- **Vercel**: ~1-2 minutes
- **Render**: ~2-3 minutes

---

## ⚠️ Important Notes

### Render Free Tier
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- This is normal behavior for free tier

### Vercel URLs
- Your current URL is a preview/deployment URL
- You can set a custom domain in Vercel settings
- Or use the shorter production URL if available

---

## 📊 Current Status

- ✅ Backend deployed on Render
- ✅ Frontend deployed on Vercel
- ✅ CORS configured
- ✅ API URL configured
- ⏳ Ready to test!
