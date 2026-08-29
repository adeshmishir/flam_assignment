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

const STUDY_RESPONSE_SHAPE = `{
  "title": "A short title for the study material",
  "summary": "A concise explanation of the topic.",
  "blocks": [
    { "type": "card", "title": "Key idea", "body": "A paragraph explaining the key idea." },
    { "type": "chart", "title": "Growth over time", "labels": ["2020", "2021", "2022"], "values": [10, 25, 40], "unit": "MB" },
    { "type": "checklist", "title": "Checklist", "items": ["Item one", "Item two", "Item three"] }
  ],
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
}`

const SYSTEM_PROMPT = `You are a study material generator. Your job is to convert the user's topic or notes into structured study material.

Rules:
- Respond with JSON ONLY. No Markdown, no code fences, no commentary outside the JSON.
- The response MUST match this exact structure:
${STUDY_RESPONSE_SHAPE}
- "blocks" is an optional array of rich study content. Use only these block types:
  * card — { "type": "card", "title": "...", "body": "..." } for key ideas, mnemonics, or short explainers.
  * chart — { "type": "chart", "title": "...", "labels": [...], "values": [...], "unit": "..." } for comparisons or progress. "labels" and "values" MUST have the same length and at least 2 entries each; use plain numbers.
  * checklist — { "type": "checklist", "title": "...", "items": ["..."] } for steps, do's and don'ts, or review points.
- Include blocks only when they genuinely help the topic. When unsure, omit "blocks" entirely.
- Generate useful, accurate flashcards that help test memory.
- Generate useful multiple-choice quiz questions that test understanding.
- Every quiz question MUST have exactly 4 options.
- "answer" MUST be a zero-based index (0, 1, 2, or 3) pointing to the correct option.
- Use only valid JSON. Do not add trailing commas or comments.`

const REFINE_SYSTEM_PROMPT = `You are an expert editor of study material. The user supplies existing study material (JSON) and a follow-up instruction.

Rules:
- Respond with JSON ONLY. No Markdown, no code fences, no commentary outside the JSON.
- Return the FULL updated study material as JSON, preserving the same structure:
${STUDY_RESPONSE_SHAPE}
- Apply the user's follow-up instruction to the existing material (add, remove, reword, restructure, or fix content as requested).
- Keep every flashcard question/answer non-empty, keep exactly 4 options per quiz question, and keep "answer" as a zero-based index pointing at the correct option.
- Keep "blocks" only if it still makes sense after the edit; you may add, change, or remove blocks.
- Do not invent facts that are not supported. Do not change the meaning of correct content.`

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

function parseAndValidate(rawText) {
  const parsed = extractJson(rawText)
  const result = studyResponseSchema.safeParse(parsed)
  if (!result.success) {
    throw new LlmValidationError('LLM response failed schema validation')
  }
  return result.data
}

function requireClient() {
  if (!groq) {
    throw new LlmConfigError('LLM_API_KEY is not configured on the server')
  }
  return groq
}

export async function generateStudyMaterial(prompt) {
  const client = requireClient()

  const completion = await client.chat.completions.create({
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

  return parseAndValidate(rawText)
}

/**
 * Streams the generated JSON token-by-token from the LLM provider.
 * `onProgress(text)` is throttled to report the raw accumulated text as it
 * grows, and the final validated result is returned once complete.
 */
export async function streamStudyMaterial(prompt, { onProgress, isAborted } = {}) {
  const client = requireClient()

  const stream = await client.chat.completions.create({
    model,
    temperature: 0.7,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
  })

  let rawText = ''
  let lastEmit = 0

  for await (const chunk of stream) {
    if (isAborted && isAborted()) {
      break
    }
    const delta = chunk.choices?.[0]?.delta?.content
    if (delta) {
      rawText += delta
      if (onProgress) {
        const now = Date.now()
        if (now - lastEmit >= 120) {
          lastEmit = now
          onProgress(rawText)
        }
      }
    }
  }

  if (isAborted && isAborted()) {
    throw new LlmEmptyResponseError('Stream aborted')
  }

  if (!rawText.trim()) {
    throw new LlmEmptyResponseError('LLM returned an empty response')
  }

  if (onProgress) {
    onProgress(rawText)
  }

  return parseAndValidate(rawText)
}

/**
 * Applies a follow-up instruction to existing study material and returns the
 * updated, validated result.
 */
export async function refineStudyMaterial(current, instruction) {
  const client = requireClient()

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.6,
    messages: [
      { role: 'system', content: REFINE_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `EXISTING STUDY MATERIAL (JSON):\n${JSON.stringify(current)}\n\nFOLLOW-UP INSTRUCTION:\n${instruction}`,
      },
    ],
  })

  const rawText = completion.choices?.[0]?.message?.content
  if (!rawText || !rawText.trim()) {
    throw new LlmEmptyResponseError('LLM returned an empty response')
  }

  return parseAndValidate(rawText)
}