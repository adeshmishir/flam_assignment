# AI Study Assistant

A React study assistant that turns pasted notes or a topic into interactive
flashcards and a quiz, powered by a real LLM via a Node.js/Express backend.

**This is not a chatbot.** The LLM returns structured JSON, which is validated
with Zod before the frontend renders it.

## Architecture

```
User Browser
     │
     ▼
Frontend Hosting (React + Vite)
     │
     │  HTTPS / API request (/api)
     ▼
Backend Hosting (Node.js + Express)
     │
     │  Secret API key
     ▼
Groq LLM API
```

The backend is the trusted boundary that holds the LLM API key. The browser
never talks to Groq directly:

```
Browser ❌ → Groq directly
Browser ✅ → Backend → Groq
```

## Structure

```
frontend/   React + Vite + Tailwind app
backend/    Node.js + Express API that talks to the LLM
```

## Local Development

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend (in a second terminal):

```bash
cd frontend
npm install
npm run dev
```

During development the frontend proxies `/api` requests to the backend
(`http://localhost:4000`), so local development needs no hard-coded backend URL.

## Environment Variables

Backend (`backend/.env`):

| Variable       | Description                                      |
| -------------- | ------------------------------------------------ |
| `PORT`         | Backend port (default `4000` locally).           |
| `LLM_API_KEY`  | The Groq API key (secret, backend only).         |
| `LLM_MODEL`    | The LLM model to use.                            |

Frontend (`frontend/.env`):

| Variable        | Description                                          |
| --------------- | ---------------------------------------------------- |
| `VITE_API_URL`  | Backend API base URL (e.g. `/api` locally, a full URL in production). |

> **Never expose the LLM API key in frontend code or Vite environment variables.**
> `VITE_*` variables are baked into the public bundle at build time. Only the
> backend may hold secrets.

See `backend/.env.example` and `frontend/.env.example` for templates. Copy them
to `.env` locally and fill in real values. `.env` files are git-ignored.

## Production Deployment

### Frontend (static hosting, e.g. Vercel / Netlify)

1. `npm install`
2. `npm run build`
3. Deploy the generated `dist/` folder.
4. Set the public environment variable `VITE_API_URL` to the backend's
   production URL, e.g. `https://your-backend-url.com/api`, and rebuild.

The frontend only communicates with the backend; it never needs to know about
the LLM provider.

### Backend (hosting such as Render / Railway / Fly.io)

1. `npm install`
2. `npm start` (runs `node src/server.js`)
3. Provide deployment environment variables:
   `PORT`, `LLM_API_KEY`, and `LLM_MODEL`.

Secrets are injected by the deployment platform via environment variables and
are never committed to the repository.

## Quick start

See the sections above for setup.
