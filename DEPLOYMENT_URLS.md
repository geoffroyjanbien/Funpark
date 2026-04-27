# 🌐 Deployment URLs

## Live Application URLs

### Frontend (Vercel)
```
https://funpark-ekb5vo6ny-geoffroyjanbien-4204s-projects.vercel.app (latest)
https://funpark-57exoneln-geoffroyjanbien-4204s-projects.vercel.app (previous)
```
**Note**: Vercel creates unique URLs for each deployment. All URLs matching `https://funpark*.vercel.app` are accepted by CORS.

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
CORS_ORIGIN = http://localhost:4200
```

**Note**: The CORS configuration now accepts all Vercel deployment URLs automatically using regex pattern matching (`https://funpark*.vercel.app`). You only need to add localhost for local development.

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
