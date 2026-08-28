import { Router } from 'express'
import { generateStudyMaterial } from '../services/llmService.js'
import {
  LlmConfigError,
  LlmEmptyResponseError,
  LlmInvalidJsonError,
  LlmValidationError,
} from '../utils/errors.js'

const router = Router()

router.post('/generate', async (req, res) => {
  const prompt = req.body?.prompt

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'A non-empty prompt is required.' })
  }

  try {
    const data = await generateStudyMaterial(prompt.trim())
    return res.json(data)
  } catch (error) {
    console.error('[api/generate]', error.message)

    if (error instanceof LlmConfigError) {
      return res.status(500).json({ error: 'AI service is not configured.' })
    }

    if (error instanceof LlmEmptyResponseError) {
      return res
        .status(502)
        .json({ error: 'The AI returned an empty response. Please try again.' })
    }

    if (error instanceof LlmInvalidJsonError) {
      return res
        .status(502)
        .json({ error: 'The AI returned invalid data. Please try again.' })
    }

    if (error instanceof LlmValidationError) {
      return res
        .status(502)
        .json({ error: 'The AI returned an unexpected format. Please try again.' })
    }

    if (error.status) {
      return res
        .status(502)
        .json({ error: 'Sorry, something went wrong. Please try again.' })
    }

    return res
      .status(500)
      .json({ error: 'Sorry, something went wrong. Please try again.' })
  }
})

export default router
