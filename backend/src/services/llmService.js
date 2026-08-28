import Groq from 'groq-sdk'
import { studyResponseSchema } from '../utils/studySchema.js'
import {
  LlmConfigError,
  LlmEmptyResponseError,
  LlmInvalidJsonError,
  LlmValidationError,
} from '../utils/errors.js'

const apiKey = process.env.LLM_API_KEY
const model = process.env.LLM_MODEL || 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You are a study material generator. Your job is to convert the user's topic or notes into structured study material.

Rules:
- Respond with JSON ONLY. No Markdown, no code fences, no commentary outside the JSON.
- The response MUST match this exact structure:
{
  "title": "A short title for the study material",
  "summary": "A concise explanation of the topic.",
  "flashcards": [
    { "question": "A question about the topic", "answer": "A clear, correct answer" }
  ],
  "quiz": [
    {
      "question": "A multiple-choice question",
      "options": ["option a", "option b", "option c", "option d"],
      "answer": 0,
      "explanation": "Why this option is correct"
    }
  ]
}
- Generate useful, accurate flashcards that help test memory.
- Generate useful multiple-choice quiz questions that test understanding.
- Every quiz question MUST have exactly 4 options.
- "answer" MUST be a zero-based index (0, 1, 2, or 3) pointing to the correct option.
- The "answer" index MUST always point to the correct option.
- Use only valid JSON. Do not add trailing commas or comments.`

const groq = apiKey ? new Groq({ apiKey }) : null

function extractJson(text) {
  const trimmed = text.trim()
  if (trimmed.startsWith('{')) {
    return JSON.parse(trimmed)
  }

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    return JSON.parse(fenceMatch[1].trim())
  }

  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1))
  }

  throw new LlmInvalidJsonError('No JSON object found in LLM response')
}

export async function generateStudyMaterial(prompt) {
  if (!groq) {
    throw new LlmConfigError('LLM_API_KEY is not configured on the server')
  }

  const completion = await groq.chat.completions.create({
    model,
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
  })

  const rawText = completion.choices?.[0]?.message?.content
  if (!rawText || !rawText.trim()) {
    throw new LlmEmptyResponseError('LLM returned an empty response')
  }

  const parsed = extractJson(rawText)
  const result = studyResponseSchema.safeParse(parsed)

  if (!result.success) {
    throw new LlmValidationError('LLM response failed schema validation')
  }

  return result.data
}
