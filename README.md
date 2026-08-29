# AI Study Assistant

A full-stack AI-powered study tool that converts notes or any topic into interactive flashcards, practice quizzes, and visual study blocks.

**This is not a chatbot.** The backend requests a single structured JSON response from the LLM, validates it against a Zod schema, and only then sends a predictable shape to the frontend — so the UI is never asked to render raw or unexpected model output.

## Live Demo

- Frontend: <https://frontend-drab-eta-62.vercel.app>
- Backend API: <https://flam-assignment-n85a.onrender.com>
- A short screen recording of the app in use is included with the submission package (`docs/screen-recording.mp4`): it walks through generating material, flipping flashcards, taking the quiz, refining the result, and toggling dark mode.

## Features

- Generate study material from notes or a topic in one click.
- **Flashcards** — flip between question and answer, navigate with buttons or `←` / `→` / `Space`.
- **Multiple-choice quiz** — instant feedback, explanations, and a final score.
- **Retry incorrect questions** — re-test only what you got wrong.
- **Visual blocks** — AI can return cards, charts, and checklists alongside the text.
- **Streaming output** — the model's JSON is rendered live while it generates.
- **Refinement loop** — follow-up prompts edit the existing result in place.
- **Saved sessions** — results are persisted in `localStorage` and can be reloaded from the navigation bar.
- **Dark mode (default)** — persistent, animated light/dark toggle.
- Loading, error, and empty states with friendly, safe messages.
- Stale-response protection — `AbortController` + request IDs ensure an older request can never overwrite a newer one.
- Server-side Zod validation — the LLM output is validated before reaching the frontend.
- Fully responsive frontend, with a mobile menu.

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Framer Motion, Lucide icons

### Backend

- Node.js
- Express
- Zod (validation)

### AI

- Groq API (configurable model, e.g. `openai/gpt-oss-20b`)

## Architecture

```text
User
  ↓
React Frontend
  ↓  POST /api/generate | /api/generate/stream | /api/refine
Express Backend
  ↓  secret key (LLM_API_KEY)
Groq LLM
  ↓
Validated Structured JSON
  ↓
Flashcards · Quiz · Blocks
```

- The frontend never talks to Groq and never holds the API key.
- The backend is the **trusted boundary** that owns the key and makes every LLM call.
- LLM output is **validated with Zod on the backend** before it is sent to the frontend, so the UI always renders a known, safe shape.

## Repository Structure

```
├── backend/            Express API (routes, LLM service, Zod schema, errors)
├── frontend/           React + Vite + Tailwind app (components, hooks, services, tests)
└── scripts/dev.js      Root dev runner (starts both apps from `npm start`)
```

## Setup and Local Development

### Prerequisites

- Node.js 18+
- npm
- A Groq API key from <https://console.groq.com/keys>

### Quick start (root-level scripts)

```bash
git clone <repository-url>
cd <repository-folder>
npm install        # installs backend + frontend dependencies
cp backend/.env.example backend/.env   # then add your LLM_API_KEY
npm start          # starts the backend (:4000) and frontend (:5173)
```

Open <http://localhost:5173> and try a topic like "binary search".

### Manual (two terminals)

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env   # add your LLM_API_KEY
npm run dev            # http://localhost:4000

# Terminal 2 — frontend
cd frontend
npm install
npm run dev            # http://localhost:5173
```

During development the Vite dev server proxies `/api` to `http://localhost:4000`, so no hard-coded backend URL is needed locally.

## Environment Variables

**Backend (`backend/.env`)** — copied from `backend/.env.example`:

| Variable      | Description                            |
| ------------- | -------------------------------------- |
| `PORT`        | Backend port (default `4000`).         |
| `LLM_API_KEY` | Groq API key (**secret**, backend only). |
| `LLM_MODEL`   | Groq model available to your key.      |

**Frontend (`frontend/.env`)** — optional:

| Variable       | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `VITE_API_URL` | API base URL. `/api` locally, full URL (e.g. the Render backend) in production. |

> `VITE_*` variables are baked into the public bundle at build time and are readable by anyone. Never put an API key in a frontend variable. Only the backend may hold secrets.

## Scripts

From the repository root:

```bash
npm start       # run backend + frontend together
npm run lint    # Oxlint (frontend)
npm test        # Vitest suite (frontend)
npm run build   # Vite production build (frontend)
```

## Testing

```bash
cd frontend
npm run test:run   # Vitest run (currently 47 tests passing)
npm run lint
npm run build
```

The backend exposes `GET /health` → `{"status":"ok"}`.

## Limitations

- **An API key is required.** Without `LLM_API_KEY` the app runs, but generation returns a friendly "not configured" error.
- Groq accounts can access different model sets; if `LLM_MODEL` isn't available to your key, generation fails with a user-safe error. List available models with `curl -s -H "Authorization: Bearer $LLM_API_KEY" https://api.groq.com/openai/v1/models`.
- **Single structured pass, not a chatbot.** The LLM returns one validated JSON document. Follow-up refinement is supported, but it is not a free-form conversational interface.
- LLM responses can be imperfect. Content should be treated as a study aid, not an authoritative source.
- Model output is validated against a strict schema; unusual output is rejected with a friendly error rather than rendered unsafely.
- Saved sessions and the theme preference are stored in the browser's `localStorage` and are therefore per-device.
- Generation latency depends on provider load.

## Project Development Status & Time Spent

Approximate time spent across the different stages of the project:

| Development Stage | Approx. Time Spent |
| ----------------- | ------------------ |
| Requirement Analysis & Planning | ~45 min |
| UI/UX Design & Frontend Planning | ~45 min |
| Frontend Development | ~2 hrs |
| Backend Setup & API Development | ~1.5 hrs |
| Frontend–Backend Integration | ~45 min |
| Testing & Bug Fixing | ~45 min |
| Deployment & Final Configuration | ~20 min |
| README & Documentation | ~20 min |

**Total Approximate Time: ~7 hours**

## AI Usage

- The core feature uses a hosted LLM (Groq) to generate study material.
- Development — including parts of the codebase and this documentation — was assisted by an AI coding tool and reviewed, tested, and validated by the developer before submission.
- **Time spent:** approximately 7 hours of active development covering design, implementation, testing, and documentation (see [Project Development Status & Time Spent](#project-development-status--time-spent)).