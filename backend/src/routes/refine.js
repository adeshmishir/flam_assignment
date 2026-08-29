import { Router } from 'express'
import { refineStudyMaterial } from '../services/llmService.js'
import { llmErrorInfo } from '../utils/errors.js'

const router = Router()

router.post('/refine', async (req, res, next) => {
  const instruction = req.body?.prompt
  const current = req.body?.current

  if (typeof instruction !== 'string' || instruction.trim().length === 0) {
    return res.status(400).json({
      error: 'A non-empty follow-up instruction is required.',
      code: 'INVALID_REQUEST',
    })
  }

  if (!current || typeof current !== 'object' || Array.isArray(current)) {
    return res.status(400).json({
      error: 'The existing study material is required.',
      code: 'INVALID_REQUEST',
    })
  }

  try {
    const data = await refineStudyMaterial(current, instruction.trim())
    return res.json(data)
  } catch (error) {
    console.error('[api/refine]', error.message)

    const info = llmErrorInfo(error)
    if (info) {
      return res.status(502).json(info)
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