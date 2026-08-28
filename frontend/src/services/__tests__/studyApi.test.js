import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateStudyMaterial } from '../studyApi.js'

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
