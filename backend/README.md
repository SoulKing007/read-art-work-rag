# Ready Artwork RAG Backend

Node.js backend with LangChain and LangGraph for Ready Artwork's client knowledge system. Retrieves information from embedded documents and meeting transcripts with full source attribution.

## 🚀 Features

- **LangGraph Agent Workflow**: 6-node agent system for intelligent RAG
- **Complete Source Attribution**: Every answer includes document/meeting metadata, links, and excerpts
- **Metadata Enrichment**: Solves the n8n problem by fetching complete metadata from Supabase
- **Vector Search**: Semantic search using OpenAI embeddings and Supabase
- **REST API**: Express.js API with validation and error handling

## 📋 Prerequisites

- Node.js 20+
- Supabase account with:
  - `document_embeddings` table (vector search)
  - `client_documents` table
  - `meeting_transcripts` table
- OpenAI API key

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (e.g., `gpt-4-turbo-preview`)
- `EMBEDDING_MODEL` (e.g., `text-embedding-ada-002`)

### 3. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Chat Query

**POST** `/api/chat/query`

Execute RAG workflow and get answer with sources.

```json
{
  "query": "What are MeeFog's product specifications?",
  "conversationId": "optional-id"
}
```

Response:
```json
{
  "answer": "Based on the documents...",
  "sources": [
    {
      "type": "document",
      "name": "MeeFog Product Specs Q1 2024",
      "date": "2024-01-10",
      "url": "https://...",
      "excerpt": "...",
      "metadata": { ... },
      "relevanceScore": 0.92
    }
  ],
  "confidence": "high",
  "conversationId": "conv_123"
}
```

### Get Document

**GET** `/api/documents/:id`

Fetch complete document metadata.

### Get Meeting

**GET** `/api/meetings/:id`

Fetch complete meeting metadata.

### Search

**GET** `/api/search?q=query&type=document|meeting&limit=10`

Search documents or meetings.

## 🏗️ Architecture

### LangGraph Workflow

```
Query Analyzer → Retrieval Agent → Metadata Enricher → 
Context Ranker → Response Generator → Source Formatter
```

**Key Nodes:**

1. **Query Analyzer**: Extracts intent, keywords, timeframe
2. **Retrieval Agent**: Vector similarity search (top 10)
3. **Metadata Enricher**: ⭐ Fetches complete metadata from original tables
4. **Context Ranker**: Ranks by similarity, recency, source type (top 5)
5. **Response Generator**: LLM generates answer with citations
6. **Source Formatter**: Structures response with metadata

### Project Structure

```
backend/
├── src/
│   ├── agents/
│   │   ├── nodes/           # LangGraph agent nodes
│   │   ├── graph.ts         # Workflow definition
│   │   └── prompts.ts       # System prompts
│   ├── config/
│   │   └── index.ts         # Environment config
│   ├── middleware/
│   │   ├── validation.ts    # Request validation
│   │   └── error-handler.ts # Error handling
│   ├── routes/
│   │   ├── chat.routes.ts
│   │   ├── documents.routes.ts
│   │   └── meetings.routes.ts
│   ├── services/
│   │   └── supabase.service.ts  # Supabase client
│   ├── types/
│   │   └── database.types.ts    # TypeScript types
│   ├── utils/
│   │   ├── logger.ts
│   │   └── errors.ts
│   └── server.ts            # Express server
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚢 Deployment to Railway

### 1. Push to GitHub

```bash
git add backend/
git commit -m "Add RAG backend"
git push
```

### 2. Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `/backend`

### 3. Add Environment Variables

In Railway dashboard, add all variables from `.env.example`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `EMBEDDING_MODEL`
- `EMBEDDING_DIMENSION`
- `PORT` (Railway will auto-assign)
- `NODE_ENV=production`
- `CORS_ORIGIN` (your frontend URL)

### 4. Deploy

Railway will automatically build and deploy. Monitor logs for any issues.

### 5. Get API URL

Copy the generated Railway URL (e.g., `https://your-app.railway.app`) and use it in your frontend.

## 🧪 Testing

### Manual Testing

```bash
# Test health check
curl http://localhost:3000/health

# Test chat query
curl -X POST http://localhost:3000/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are MeeFog'\''s product specifications?"}'

# Test document fetch
curl http://localhost:3000/api/documents/doc-id-123

# Test search
curl "http://localhost:3000/api/search?q=meefog&type=document"
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role key | `eyJhbG...` |
| `SUPABASE_ANON_KEY` | Anonymous key | `eyJhbG...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `OPENAI_MODEL` | LLM model | `gpt-4-turbo-preview` |
| `EMBEDDING_MODEL` | Embedding model | `text-embedding-ada-002` |
| `EMBEDDING_DIMENSION` | Embedding dimension | `1536` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:8080` |

## 🔧 Troubleshooting

### Vector Store Initialization Fails

- Check Supabase credentials
- Verify `document_embeddings` table exists
- Ensure vector extension is enabled in Supabase

### No Results from Search

- Check if embeddings are populated in Supabase
- Verify OpenAI API key is valid
- Check embedding model matches what was used to create embeddings

### Metadata Not Found

- Verify `client_documents` and `meeting_transcripts` tables exist
- Check `source_id` and `source_type` in embedding metadata
- Ensure IDs match between tables

## 📄 License

MIT
