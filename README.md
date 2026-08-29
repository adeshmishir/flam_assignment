# AI Study Assistant

A full-stack AI-powered study tool that converts notes or any topic into interactive flashcards and practice quizzes.

**Live Demo:** https://frontend-drab-eta-62.vercel.app

---

## Features

- Generate study material from notes or any topic
- Interactive flashcards with question and answer flipping
- Multiple-choice quizzes with instant feedback and explanations
- Retry incorrect questions
- Safe handling of concurrent requests using AbortController and request IDs
- Server-side validation of LLM responses using Zod
- Responsive and user-friendly interface

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- Zod

### AI
- Groq LLM API

---

## Architecture

```text
React Frontend
      |
      v
Express Backend
      |
      v
Groq LLM
      |
      v
Structured JSON
      |
      v
Flashcards and Quiz UI
