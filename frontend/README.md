# AI Study Assistant — Frontend

The React frontend for the AI Study Assistant. It takes notes or a topic, generates interactive study material via the backend, and renders it as flashcards, a multiple-choice quiz, and key insights — all in a warm, notebook-style UI.

This is **not** a chatbot. The frontend asserts the response shape with a Zod schema and renders a predictable, validated document supplied by the backend (`/api/generate`, `/api/generate/stream`, `/api/refine`).

## Features

- One-click study material generation from notes or a topic.
- **Flashcards** — flip to reveal answers; navigate with buttons or `←` / `→` / `↑` / `↓`, plus `Home` / `End`.
- **Multiple-choice quiz** — instant feedback, explanations, live score, and retry of only the wrong questions.
- **Key insights blocks** — cards and checklists surfaced above the practice modes.
- **Flashcards / Quiz tabs** — fully keyboard navigable (arrow keys, `Home` / `End`), quiz progress survives tab switches.
- **Streaming output** — material renders live while the model generates.
- **Refinement loop** — follow-up prompts edit the existing result in place.
- **Saved sessions** — persisted in `localStorage`, reloadable from the sidebar, which is keyboard navigable (arrow keys + `Enter`).
- **Dark mode** — persistent, animated light/dark toggle.
- **Accessibility** — skip-to-content link, ARIA tabs, keyboard navigation, visible focus rings.
- Loading, error, and empty states with friendly, safe messages.
- Stale-response protection — `AbortController` + request IDs so an older request never overwrites a newer one.
- Fully responsive layout with a mobile menu.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion, Lucide icons
- Vitest + React Testing Library (unit/integration tests)
- Oxlint

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
```

During development the Vite dev server proxies `/api` to `http://localhost:4000`, so no backend URL needs to be hard-coded locally.

### Environment variables (`frontend/.env`, optional)

| Variable       | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `VITE_API_URL` | API base URL. `/api` locally, full URL (e.g. the Render backend) in production. |

> `VITE_*` variables are baked into the public bundle at build time. Never put an API key in a frontend variable.

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the Vite dev server.           |
| `npm run build`     | Production build to `dist/`.         |
| `npm run preview`   | Preview the production build.        |
| `npm run lint`      | Run Oxlint.                          |
| `npm run test`      | Run Vitest in watch mode.            |
| `npm run test:run`  | Run the Vitest suite once.           |

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