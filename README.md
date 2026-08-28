# AI Study Assistant

A React study assistant that turns pasted notes or a topic into interactive
**flashcards** and a **quiz**, powered by a large language model through a
Node.js/Express backend.

**This is not a chatbot.** The LLM returns structured JSON, which is validated
with Zod before the frontend renders it — so the UI always gets a predictable
shape to render flashcards and a quiz.

## Live Demo

- Frontend: <https://frontend-drab-eta-62.vercel.app>
- Backend API: <https://flam-assignment-n85a.onrender.com>

## Features

- Paste notes or type a topic and generate study material with one click.
- **Flashcards** — flip between question and answer, navigate forward/back.
- **Quiz** — multiple choice with instant feedback and explanations.
- **Retry wrong answers** — re-test only the questions you got wrong.
- **Loading, error, and empty states** with friendly, safe messages.
- **Stale-response protection** — AbortController + request IDs so an older
  request can never overwrite a newer one.
- **Server-side validation** — the LLM output is validated (Zod) on the backend
  before it is ever sent to the frontend.

## Architecture

```
User Browser
     │
     ▼
Frontend Hosting (React + Vite + Tailwind)
     │
     │  HTTPS / API request  (/api/generate)
     ▼
Backend Hosting (Node.js + Express)
     │
     │  Secret API key (process.env.LLM_API_KEY)
     ▼
Groq LLM API
```

The backend is the **trusted boundary** that holds the LLM API key. The browser
never talks to Groq directly:

```
Browser ❌ → Groq directly
Browser ✅ → Backend → Groq
```

## Repository structure

```
├── backend/              Node.js + Express API that talks to Groq
│   └── src/
│       ├── app.js        Express app, CORS, routes, /health
│       ├── server.js     Entry point (port from env)
│       ├── routes/       /api/generate
│       ├── services/     Groq LLM integration
│       └── utils/        Zod schema + typed errors
└── frontend/             React + Vite + Tailwind app
    └── src/              UI, components, API service, tests
```

## Requirements

- Node.js 18+ (both apps)
- A Groq API key from <https://console.groq.com/keys>
- npm

---

## Local Development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in LLM_API_KEY
npm run dev
```

The backend listens on `http://localhost:4000` (from `PORT` in `.env`).

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. During development the Vite dev server proxies
`/api` requests to `http://localhost:4000`, so no hard-coded backend URL is
needed locally.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable      | Description                                             |
| ------------- | ------------------------------------------------------- |
| `PORT`        | Backend port (default `4000` locally).                  |
| `LLM_API_KEY` | The Groq API key (**secret** — backend only).           |
| `LLM_MODEL`   | The Groq model to use (must be available to your key).  |

Example:

```bash
PORT=4000
LLM_API_KEY=your-groq-api-key
LLM_MODEL=openai/gpt-oss-20b
```

> **Model note:** Groq accounts can access different model sets. Run
> `curl -s -H "Authorization: Bearer $LLM_API_KEY" https://api.groq.com/openai/v1/models`
> to list the models your key can use, and set `LLM_MODEL` to one of them.

### Frontend (`frontend/.env`)

| Variable       | Description                                                                |
| -------------- | -------------------------------------------------------------------------- |
| `VITE_API_URL` | Backend API base URL. `/api` locally; a full URL in production, e.g. `https://flam-assignment-n85a.onrender.com/api` |

Example:

```bash
VITE_API_URL=/api
```

> **Never expose the LLM API key in frontend code or in `VITE_*` variables.**
> `VITE_*` variables are baked into the public JavaScript bundle at build time
> and are readable by anyone. Only the backend may hold secrets.

See `backend/.env.example` and `frontend/.env.example` for templates. Copy each
to `.env` and fill in real values. `.env` files are git-ignored and never
committed.

---

## Production Deployment

Frontend and backend are deployed **independently** on different platforms.

### Frontend (Vercel / Netlify — static hosting)

1. Set the environment variable on the hosting platform:
   `VITE_API_URL=https://flam-assignment-n85a.onrender.com/api`
2. Deploy with:
   ```bash
   npm install
   npm run build
   ```
3. Host the generated `dist/` folder (Vercel/Netlify build this for you).

The frontend only talks to the backend — it never needs to know the LLM
provider or hold any secret.

**Important:** `VITE_*` values are read at **build time**. After changing
`VITE_API_URL`, you must rebuild/redeploy the frontend.

### Backend (Render / Railway / Fly.io — Node hosting)

1. Point the service at the `backend/` directory.
2. Build/start commands:
   ```bash
   npm install
   npm start   # runs `node src/server.js`
   ```
3. Set these deployment environment variables:
   | Variable      | Value                                                        |
   | ------------- | ------------------------------------------------------------ |
   | `PORT`        | Provided by the platform (Render sets this automatically).   |
   | `LLM_API_KEY` | Your Groq API key (**secret**).                              |
   | `LLM_MODEL`   | A model available to your key (e.g. `openai/gpt-oss-20b`).   |

4. Expose the service publicly and use its public API URL
   (e.g. `https://flam-assignment-n85a.onrender.com`) as `VITE_API_URL` in the
   frontend (with `/api` appended).

### CORS

The backend uses a **hardcoded allowlist** of frontend origins
(see `backend/src/app.js`):

```js
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://frontend-drab-eta-62.vercel.app',
]
```

Only these origins may call the API. `OPTIONS` preflight for
`POST /api/generate` is handled automatically by the CORS middleware. To allow
another frontend, add its origin to this list and redeploy the backend.

### Health check

The backend exposes `GET /health`, which returns:

```json
{ "status": "ok" }
```

Use it to confirm the service is up. It does not expose keys, environment
variables, internal paths, or stack traces.

---

## Security

- The **Groq API key lives only on the backend** via `process.env.LLM_API_KEY`
  and is never sent to the browser.
- `.env` files are git-ignored; only `.env.example` templates are committed.
- CORS is restricted to a specific allowlist — not `origin: "*"`.
- Errors sent to the client are **safe, user-friendly messages only** — no
  stack traces, provider internals, API keys, or filesystem paths leak out.
- LLM output is schema-validated on the backend before it reaches the UI.

---

## Testing / Lint / Build (frontend)

```bash
cd frontend
npm run test:run   # Vitest test suite
npm run lint       # Oxlint
npm run build      # Vite production build → dist/
```

## Quick start

```bash
# Backend
cd backend
npm install
cp .env.example .env  # add your LLM_API_KEY
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173> and search a topic like "binary search".
