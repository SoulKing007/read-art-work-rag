# Production Deployment Guide

## Option 1: Both Frontend & Backend on Railway (Recommended)

Railway can host both your frontend and backend in the same project using **two separate services**.

### Step 1: Deploy Backend API

1. **Go to Railway.app**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Backend Service**
   - Railway will auto-detect and create a service
   - Go to service settings
   - Set **Root Directory**: `api`
   - Add environment variables:
     ```
     OPENAI_API_KEY=your_openai_key
     OPENAI_MODEL=gpt-4o-mini
     EMBEDDING_MODEL=text-embedding-3-small
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_KEY=your_supabase_key
     PORT=8000
     ```
   - Railway will give you a URL like: `https://your-backend.railway.app`

3. **Copy Backend URL** - You'll need this for the frontend

### Step 2: Deploy Frontend

1. **In the same Railway project**
   - Click "New Service"
   - Select "GitHub Repo" (same repo)
   - This creates a second service

2. **Configure Frontend Service**
   - Go to service settings
   - Set **Root Directory**: `.` (root)
   - Set **Build Command**: `npm install && npm run build`
   - Set **Start Command**: `npx serve -s dist -l $PORT`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend.railway.app
     ```
   - Railway will give you a URL like: `https://your-frontend.railway.app`

### Step 3: Update CORS (Important!)

Update `api/main.py` to allow your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend.railway.app"  # Add your Railway frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Test

1. Visit your frontend URL: `https://your-frontend.railway.app`
2. Try chatting - it should connect to your backend
3. Check Railway logs if there are issues

---

## Option 2: Backend on Railway, Frontend on Vercel

### Backend (Railway)
Follow Step 1 above

### Frontend (Vercel)

1. **Go to Vercel.com**
   - Import your GitHub repository
   - Framework Preset: Vite
   - Root Directory: `.`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Add Environment Variable**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

3. **Deploy**
   - Vercel will give you a URL like: `https://your-app.vercel.app`

4. **Update CORS** in `api/main.py`:
   ```python
   allow_origins=[
       "http://localhost:5173",
       "https://your-app.vercel.app"
   ]
   ```

---

## Current Project Structure

```
read-art-work-rag/
├── api/                    # Backend (Python/FastAPI)
│   ├── main.py
│   ├── requirements.txt
│   └── .env (local only)
├── src/                    # Frontend (React/Vite)
│   ├── components/
│   ├── pages/
│   └── main.tsx
├── package.json            # Frontend dependencies
├── nixpacks.toml          # Railway backend config
└── railway.json           # Railway config
```

---

## Environment Variables Summary

### Backend (.env or Railway)
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_KEY=eyJ...
PORT=8000
```

### Frontend (.env.local or Railway/Vercel)
```
VITE_API_URL=https://your-backend.railway.app
```

---

## Troubleshooting

### CORS Errors
- Make sure frontend URL is in `allow_origins` in `api/main.py`
- Redeploy backend after updating CORS

### Frontend can't connect to backend
- Check `VITE_API_URL` is set correctly
- Check backend is running (visit `/health` endpoint)
- Check browser console for errors

### Backend errors
- Check Railway logs
- Verify all environment variables are set
- Check Supabase connection

---

## Cost Estimate

### Railway (Both services)
- Free tier: $5 credit/month
- Backend: ~$5-10/month
- Frontend: ~$5/month
- Total: ~$10-15/month

### Railway + Vercel
- Railway Backend: ~$5-10/month
- Vercel Frontend: Free (Hobby plan)
- Total: ~$5-10/month

---

## Quick Commands

### Local Development
```bash
# Backend
cd api
python main.py

# Frontend (new terminal)
npm run dev
```

### Check Deployment
```bash
# Backend health
curl https://your-backend.railway.app/health

# Frontend
curl https://your-frontend.railway.app
```
