# MeeFog RAG Knowledge Assistant

AI-powered knowledge assistant for MeeFog client account using RAG (Retrieval Augmented Generation).

## Project Structure

```
read-art-work-rag/
├── backend/           # Python FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   ├── nixpacks.toml
│   └── railway.toml
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── railway.toml
├── schema/            # Database schema
└── DEPLOYMENT.md      # Deployment guide
```

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy on Railway

**Backend:**
- Root Directory: `backend`
- Add environment variables (OpenAI, Supabase)

**Frontend:**
- Root Directory: `frontend`
- Add environment variable: `VITE_API_URL`

## Technologies

- **Backend:** Python, FastAPI, LangChain, Supabase
- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **AI:** OpenAI GPT-4, Text Embeddings
- **Database:** Supabase (PostgreSQL + Vector)
