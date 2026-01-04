# Ready Artwork RAG System

Client knowledge system for MeeFog with RAG (Retrieval-Augmented Generation) powered by LangChain and LangGraph.

## Project Structure

This is a monorepo containing:
- **Frontend**: React + TypeScript + Vite + Shadcn UI (root directory)
- **Backend**: Node.js + LangChain + LangGraph RAG API (`/backend` directory)

## Frontend Setup

The frontend is a React application built with modern tools.

Requirements: Node.js 20+ & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Frontend Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:8080`

### Backend Development

See the [backend README](./backend/README.md) for detailed setup instructions.

```sh
cd backend
npm install
cp .env.example .env
# Add your credentials to .env
npm run dev
```

The backend will run on `http://localhost:3000`

## Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Shadcn UI
- Tailwind CSS
- React Router
- TanStack Query

### Backend
- Node.js 20+
- LangChain.js
- LangGraph
- Supabase (Vector Store)
- OpenAI (LLM & Embeddings)
- Express.js
- TypeScript

## Deployment

### Frontend
Deploy the frontend to any static hosting service (Vercel, Netlify, etc.)

```sh
npm run build
```

### Backend
Deploy the backend to Railway. See [backend/README.md](./backend/README.md) for detailed instructions.

## License

MIT
