import { Router } from 'express'
import { streamStudyMaterial } from '../services/llmService.js'
import { llmErrorMessage } from '../utils/errors.js'

const router = Router()

router.post('/generate/stream', async (req, res) => {
  const prompt = req.body?.prompt

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      error: 'A non-empty prompt is required.',
      code: 'INVALID_REQUEST',
    })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  let clientConnected = true
  req.on('close', () => {
    clientConnected = false
  })

  const send = (event, data) => {
    if (!clientConnected) {
      return
    }
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  try {
    const result = await streamStudyMaterial(prompt.trim(), {
      onProgress: (text) => send('progress', { text }),
      isAborted: () => !clientConnected,
    })

    if (!clientConnected) {
      res.end()
      return
    }

    send('done', result)
    res.end()
  } catch (error) {
    console.error('[api/generate/stream]', error.message)

    if (!clientConnected) {
      res.end()
      return
    }

    send('error', { error: llmErrorMessage(error) })
    res.end()
  }
})

export default router