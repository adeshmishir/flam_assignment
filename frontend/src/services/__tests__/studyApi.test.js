import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  generateStudyMaterial,
  streamStudyMaterial,
  refineStudyMaterial,
} from '../studyApi.js'

describe('generateStudyMaterial', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends a POST to /api/generate with the prompt and JSON headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ title: 'X', flashcards: [], quiz: [] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await generateStudyMaterial('Binary Search')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/generate')
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({ prompt: 'Binary Search' })
    expect(result).toEqual({ title: 'X', flashcards: [], quiz: [] })
  })

  it('parses and returns the JSON body, and passes an external signal to fetch', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ title: 'T' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const controller = new AbortController()
    await generateStudyMaterial('React', { signal: controller.signal })

    const options = fetchMock.mock.calls[0][1]
    expect(options.signal).toBe(controller.signal)
  })

  it('throws a user-safe error on a non-2xx response and preserves the backend message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ error: 'The AI returned invalid data. Please try again.' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(generateStudyMaterial('React')).rejects.toThrow(
      'The AI returned invalid data. Please try again.'
    )
  })

  it('uses a safe fallback message when a non-2xx response has no error field', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(generateStudyMaterial('React')).rejects.toThrow(
      'Something went wrong while generating your study material. Please try again.'
    )
  })

  it('throws a user-friendly message on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(generateStudyMaterial('React')).rejects.toThrow(
      'Unable to connect to the server. Please try again.'
    )
  })

  it('rejects a body that is not an object (e.g. an array or null)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })
    )
    await expect(generateStudyMaterial('React')).rejects.toThrow(
      'The AI returned an unexpected response. Please try again.'
    )

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => null,
      })
    )
    await expect(generateStudyMaterial('React')).rejects.toThrow(
      'The AI returned an unexpected response. Please try again.'
    )
  })

  it('throws a friendly error when the response body is not valid JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token')
        },
      })
    )
    await expect(generateStudyMaterial('React')).rejects.toThrow(
      'The AI returned an unexpected response. Please try again.'
    )
  })

  it('propagates an AbortError instead of converting it to a network error', async () => {
    const abortError = new DOMException('The operation was aborted.', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError))

    await expect(generateStudyMaterial('React')).rejects.toMatchObject({
      name: 'AbortError',
    })
  })
})

function makeSseResponse(chunks) {
  let index = 0
  return {
    ok: true,
    status: 200,
    body: {
      getReader() {
        return {
          read: async () =>
            index < chunks.length
              ? { value: chunks[index++], done: false }
              : { value: undefined, done: true },
        }
      },
    },
  }
}

describe('streamStudyMaterial', () => {
  const progressPayload = (text) =>
    `event: progress\ndata: ${JSON.stringify({ text })}\n\n`
  const donePayload = (data) => `event: done\ndata: ${JSON.stringify(data)}\n\n`
  const errorPayload = (message) => `event: error\ndata: ${JSON.stringify({ error: message })}\n\n`

  it('POSTs to /api/generate/stream and resolves the done payload, reporting progress', async () => {
    const encoder = new TextEncoder()
    const progressText = 'null fragment'
    const doneData = { title: 'Binary Search', flashcards: [], quiz: [] }
    const chunks = [
      encoder.encode(progressPayload(progressText)),
      encoder.encode(donePayload(doneData)),
    ]
    const fetchMock = vi.fn().mockResolvedValue(makeSseResponse(chunks))
    vi.stubGlobal('fetch', fetchMock)

    const progressEvents = []
    const result = await streamStudyMaterial('Binary Search', {
      onProgress: (text) => progressEvents.push(text),
    })

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/generate/stream')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ prompt: 'Binary Search' })
    expect(progressEvents).toContain(progressText)
    expect(result).toEqual(doneData)
  })

  it('handles an SSE event split across multiple chunks', async () => {
    const encoder = new TextEncoder()
    const doneData = { title: 'T', flashcards: [], quiz: [] }
    const blob = donePayload(doneData)
    const middle = Math.floor(blob.length / 2)
    const chunks = [
      encoder.encode(blob.slice(0, middle)),
      encoder.encode(blob.slice(middle)),
    ]
    const fetchMock = vi.fn().mockResolvedValue(makeSseResponse(chunks))
    vi.stubGlobal('fetch', fetchMock)

    const result = await streamStudyMaterial('T')
    expect(result).toEqual(doneData)
  })

  it('falls back to response.json() when the body has no reader', async () => {
    const data = { title: 'T', flashcards: [], quiz: [] }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => data })
    )

    const progressEvents = []
    const result = await streamStudyMaterial('React', {
      onProgress: (text) => progressEvents.push(text),
    })

    expect(result).toEqual(data)
    expect(progressEvents).toEqual([JSON.stringify(data)])
  })

  it('throws a friendly error when the stream emits an error event', async () => {
    const encoder = new TextEncoder()
    const chunks = [
      encoder.encode(progressPayload('partial')),
      encoder.encode(errorPayload('The AI provider is unavailable. Please try again.')),
    ]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeSseResponse(chunks)))

    await expect(streamStudyMaterial('React')).rejects.toThrow(
      'The AI provider is unavailable. Please try again.'
    )
  })

  it('preserves the backend error message on a non-2xx response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ error: 'The AI returned invalid data. Please try again.' }),
      })
    )

    await expect(streamStudyMaterial('React')).rejects.toThrow(
      'The AI returned invalid data. Please try again.'
    )
  })

  it('rejects a streamed payload that is not an object', async () => {
    const encoder = new TextEncoder()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(makeSseResponse([encoder.encode(donePayload([]))]))
    )

    await expect(streamStudyMaterial('React')).rejects.toThrow(
      'The AI returned an unexpected response. Please try again.'
    )
  })
})

describe('refineStudyMaterial', () => {
  it('POSTs the current material and instruction to /api/refine', async () => {
    const data = { title: 'T', flashcards: [], quiz: [] }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => data })
    vi.stubGlobal('fetch', fetchMock)

    const current = { title: 'Old' }
    const result = await refineStudyMaterial(current, 'make it harder')

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/refine')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ current, prompt: 'make it harder' })
    expect(result).toEqual(data)
  })

  it('propagates backend error messages and AbortError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({ error: 'The AI returned invalid data. Please try again.' }),
      })
    )
    await expect(refineStudyMaterial({}, 'x')).rejects.toThrow(
      'The AI returned invalid data. Please try again.'
    )

    const abortError = new DOMException('The operation was aborted.', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError))
    await expect(refineStudyMaterial({}, 'x')).rejects.toMatchObject({
      name: 'AbortError',
    })
  })

  it('throws a user-friendly message on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(refineStudyMaterial({}, 'x')).rejects.toThrow(
      'Unable to connect to the server. Please try again.'
    )
  })
})
