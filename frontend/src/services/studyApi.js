const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function generateStudyMaterial(prompt, options = {}) {
  const controller = new AbortController()
  const signal = options.signal || controller.signal

  let response
  try {
    response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }
    throw new Error('Unable to connect to the server. Please try again.')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('The AI returned an unexpected response. Please try again.')
  }

  if (!response.ok) {
    const message =
      typeof data?.error === 'string' && data.error
        ? data.error
        : 'Something went wrong while generating your study material. Please try again.'
    throw new Error(message)
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The AI returned an unexpected response. Please try again.')
  }

  return data
}

function parseSseEvent(block) {
  const lines = block.split('\n')
  let event = 'message'
  const dataLines = []

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart())
    }
  }

  if (dataLines.length === 0) {
    return null
  }

  const raw = dataLines.join('\n')
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    data = raw
  }

  return { event, data }
}

/**
 * Streams study material over an SSE connection.
 *
 * Real browsers expose a body reader, so the progress events are surfaced via
 * `onProgress`. For environments without streaming support (older browsers,
 * tests) the response falls back to a single JSON load that still reports via
 * `onProgress` once.
 */
export async function streamStudyMaterial(prompt, options = {}) {
  const controller = new AbortController()
  const signal = options.signal || controller.signal

  let response
  try {
    response = await fetch(`${API_BASE}/generate/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }
    throw new Error('Unable to connect to the server. Please try again.')
  }

  const hasBodyReader = typeof response.body?.getReader === 'function'

  if (!response.ok) {
    let data
    try {
      data = await response.json()
    } catch {
      data = null
    }
    const message =
      typeof data?.error === 'string' && data.error
        ? data.error
        : 'Something went wrong while generating your study material. Please try again.'
    throw new Error(message)
  }

  if (!hasBodyReader) {
    let data
    try {
      data = await response.json()
    } catch {
      throw new Error('The AI returned an unexpected response. Please try again.')
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('The AI returned an unexpected response. Please try again.')
    }

    const raw = JSON.stringify(data)
    if (options.onProgress) {
      options.onProgress(raw)
    }
    return data
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let doneData = null
  let streamError = null

  const handleBlock = (block) => {
    const parsed = parseSseEvent(block)
    if (!parsed) {
      return
    }
    if (parsed.event === 'progress') {
      if (typeof parsed.data?.text === 'string' && options.onProgress) {
        options.onProgress(parsed.data.text)
      }
    } else if (parsed.event === 'done') {
      doneData = parsed.data
    } else if (parsed.event === 'error') {
      streamError =
        typeof parsed.data?.error === 'string' && parsed.data.error
          ? parsed.data.error
          : 'Something went wrong while generating your study material. Please try again.'
    }
  }

  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) {
        break
      }
      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split('\n\n')
      buffer = blocks.pop() || ''
      for (const block of blocks) {
        handleBlock(block)
      }
    }

    if (buffer.trim()) {
      handleBlock(buffer)
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }
    throw new Error('Unable to read the response from the server. Please try again.')
  }

  if (streamError) {
    throw new Error(streamError)
  }

  if (!doneData || typeof doneData !== 'object' || Array.isArray(doneData)) {
    throw new Error('The AI returned an unexpected response. Please try again.')
  }

  return doneData
}

/**
 * Applies a follow-up instruction to existing study material.
 */
export async function refineStudyMaterial(current, instruction, options = {}) {
  const controller = new AbortController()
  const signal = options.signal || controller.signal

  let response
  try {
    response = await fetch(`${API_BASE}/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ current, prompt: instruction }),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }
    throw new Error('Unable to connect to the server. Please try again.')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('The AI returned an unexpected response. Please try again.')
  }

  if (!response.ok) {
    const message =
      typeof data?.error === 'string' && data.error
        ? data.error
        : 'Something went wrong while refining your study material. Please try again.'
    throw new Error(message)
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('The AI returned an unexpected response. Please try again.')
  }

  return data
}
