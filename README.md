# AI Study Assistant

A React study assistant that turns pasted notes or a topic into interactive
flashcards and a quiz, powered by a real LLM via a Node.js/Express backend.

**This is not a chatbot.** The LLM returns structured JSON, which is validated
with Zod before the frontend renders it.

## Architecture

```
React (frontend)
  -> Express backend
    -> LLM API
      -> structured JSON
        -> Zod validation
          -> React
            -> interactive UI
```

## Structure

```
frontend/   React + Vite + Tailwind app
backend/    Node.js + Express API that talks to the LLM
```

## Quick start

See `README.md` at the project root for full setup (Module 15).
