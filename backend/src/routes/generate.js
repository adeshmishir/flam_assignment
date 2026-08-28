import { Router } from 'express'
import { generateStudyMaterial } from '../services/llmService.js'
import {
  LlmConfigError,
  LlmEmptyResponseError,
  LlmInvalidJsonError,
  LlmValidationError,
} from '../utils/errors.js'

const router = Router()

router.post('/generate', async (req, res, next) => {
  const prompt = req.body?.prompt

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      error: 'A non-empty prompt is required.',
      code: 'INVALID_REQUEST',
    })
  }

  try {
    const data = await generateStudyMaterial(prompt.trim())
    return res.json(data)
  } catch (error) {
    console.error('[api/generate]', error.message)

    if (error instanceof LlmConfigError) {
      return res.status(500).json({
        error: 'The AI service is not configured.',
        code: 'LLM_CONFIG',
      })
    }

    if (error instanceof LlmEmptyResponseError) {
      return res.status(502).json({
        error: 'The AI returned an empty response. Please try again.',
        code: 'LLM_EMPTY_RESPONSE',
      })
    }

    if (error instanceof LlmInvalidJsonError) {
      return res.status(502).json({
        error: 'The AI returned invalid data. Please try again.',
        code: 'LLM_INVALID_JSON',
      })
    }

    if (error instanceof LlmValidationError) {
      return res.status(502).json({
        error: 'The AI returned an unexpected format. Please try again.',
        code: 'LLM_INVALID_RESPONSE',
      })
    }

    // Known upstream/provider errors surface a status on the SDK error.
    if (error.status) {
      return res.status(502).json({
        error: 'The AI provider is unavailable. Please try again.',
        code: 'UPSTREAM_ERROR',
      })
    }

    return next(error)
  }
})

// Final safety net for any unexpected/uncaught error during a request.
router.use((error, req, res, next) => {
  console.error('[api] unhandled error', error)
  return res.status(500).json({
    error: 'Sorry, something went wrong. Please try again.',
    code: 'INTERNAL_ERROR',
  })
})

export default router
