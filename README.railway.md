# Railway Deployment Guide

## Environment Variables Required

Add these in Railway dashboard:

```
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=8000
```

## Deployment Steps

1. **Connect Repository**
   - Go to railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository

2. **Configure Environment Variables**
   - Go to project settings
   - Add all environment variables listed above

3. **Deploy**
   - Railway will automatically detect the configuration
   - Build and deploy will start automatically
   - Your API will be available at the generated Railway URL

4. **Update Frontend**
   - Update `src/components/chat/ChatInterface.tsx`
   - Replace `http://localhost:3000` with your Railway URL
   - Example: `https://your-app.railway.app`

## API Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Chat endpoint
- `GET /api/documents` - Search documents
- `GET /api/meetings` - Search meetings

## Monitoring

- Check logs in Railway dashboard
- Monitor memory and CPU usage
- Set up alerts for errors
