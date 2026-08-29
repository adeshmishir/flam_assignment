# AI Study Assistant — Backend

The Express API for the AI Study Assistant. It owns the LLM credentials, calls Groq through the `groq-sdk`, validates every model response with a Zod schema, and only then returns a predictable shape to the frontend.

The backend is the **trusted boundary**: the frontend never talks to Groq and never holds the API key.

## Endpoints

| Method | Endpoint                | Description |
| ------ | ----------------------- | ----------- |
| `GET`  | `/health`               | Liveness check → `{"status":"ok"}`. |
| `POST` | `/api/generate`         | Generate study material from a prompt. |
| `POST` | `/api/generate/stream`  | Stream the generated JSON as it is produced. |
| `POST` | `/api/refine`           | Follow up on an existing result to refine it in place. |

## What the LLM is asked to produce

- **Key insights** — exactly 2 blocks (`card` and/or `checklist`).
- **Flashcards** — 4–6 question/answer pairs.
- **Quiz** — 4–6 multiple-choice questions, each with exactly 4 options and a zero-based answer index.

Every response is validated against a strict Zod schema (`src/utils/studySchema.js`) before it reaches the frontend; output that does not conform is rejected with a friendly error.

## Tech Stack

- Node.js + Express
- `groq-sdk`
- Zod (validation)
- CORS, dotenv

## Setup

```bash
npm install
cp .env.example .env   # add your LLM_API_KEY
npm run dev            # http://localhost:4000
```

### Environment variables (`backend/.env`)

| Variable      | Description                            |
| ------------- | -------------------------------------- |
| `PORT`        | Backend port (default `4000`).         |
| `LLM_API_KEY` | Groq API key (**secret**, backend only). |
| `LLM_MODEL`   | Groq model available to your key.      |

## Scripts

| Command     | Description                           |
| ----------- | ------------------------------------- |
| `npm run dev`   | Run with watch mode (`node --watch src/server.js`). |
| `npm start`     | Run the server (`node src/server.js`). |

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