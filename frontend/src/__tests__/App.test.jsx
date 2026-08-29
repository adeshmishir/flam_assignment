import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

function makeResponse(data) {
  return { ok: true, status: 200, json: async () => data }
}

function makeErrorResponse(message = 'Something failed') {
  return {
    ok: false,
    status: 500,
    json: async () => ({ error: message }),
  }
}

const validData = {
  title: 'React Basics',
  summary: 'A summary about React.',
  flashcards: [{ question: 'FC Q', answer: 'FC A' }],
  quiz: [{ question: 'Quiz Q', options: ['a', 'b', 'c', 'd'], answer: 0, explanation: 'e' }],
}

describe('App generation flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function generateNotes(user, text) {
    const input = screen.getByLabelText('Your notes or topic')
    await user.clear(input)
    await user.type(input, text)
    const button = screen.getByRole('button', { name: /Generate Study Material|Generating/ })
    await user.click(button)
  }

  it('shows an idle empty state before any generation', () => {
    render(<App />)
    expect(screen.getByText('Start Learning')).toBeInTheDocument()
  })

  it('goes idle -> loading -> success and renders study material', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeResponse(validData)))
    const user = userEvent.setup()
    render(<App />)

    await generateNotes(user, 'React')

    expect(await screen.findByRole('heading', { name: 'React Basics' })).toBeInTheDocument()
    expect(screen.getByText(validData.summary)).toBeInTheDocument()
    expect(screen.getByText('FC Q')).toBeInTheDocument()
    expect(screen.getByText('Quiz Q')).toBeInTheDocument()
  })

  it('shows a loading state and lets a new request supersede while generating', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise(() => {}))
    )
    const user = userEvent.setup()
    render(<App />)

    await generateNotes(user, 'React')

    expect(screen.getByText('Generating your study material...')).toBeInTheDocument()
    // The button reflects the in-flight request but stays enabled so a newer request can supersede it.
    expect(screen.getByRole('button', { name: 'Generating...' })).toBeEnabled()
  })

  it('goes idle -> loading -> error and renders a friendly error, not stale material', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeErrorResponse('The AI returned invalid data. Please try again.')))
    const user = userEvent.setup()
    render(<App />)

    await generateNotes(user, 'React')

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('The AI returned invalid data. Please try again.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
    // No study material rendered.
    expect(screen.queryByRole('heading', { name: 'React Basics' })).not.toBeInTheDocument()
  })

  it('recovers from an error via Try Again to a successful result', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeErrorResponse('The AI returned invalid data. Please try again.'))
      .mockResolvedValueOnce(makeResponse(validData))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<App />)

    await generateNotes(user, 'React')
    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(await screen.findByRole('heading', { name: 'React Basics' })).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('keeps the latest request result even when an older request resolves later', async () => {
    const resolvers = []
    const signals = []
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url, options) => {
        signals.push(options.signal)
        return new Promise((resolve) => {
          resolvers.push(resolve)
        })
      })
    )
    const user = userEvent.setup()
    render(<App />)

    // Request A (React)
    await generateNotes(user, 'React')
    // Request B (Node.js)
    await generateNotes(user, 'Node.js')

    // B resolves first
    resolvers[1](makeResponse({ ...validData, title: 'Node.js' }))
    expect(await screen.findByRole('heading', { name: /Node\.js/ })).toBeInTheDocument()

    // A resolves later — must NOT overwrite B
    resolvers[0](makeResponse({ ...validData, title: 'React' }))
    await new Promise((r) => setTimeout(r, 0))

    expect(screen.getByRole('heading', { name: /Node\.js/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /React/ })).not.toBeInTheDocument()
  })

  it('aborts the previous request when a newer request starts', async () => {
    const signals = []
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url, options) => {
        signals.push(options.signal)
        return new Promise(() => {})
      })
    )
    const user = userEvent.setup()
    render(<App />)

    await generateNotes(user, 'React')
    await generateNotes(user, 'Node.js')

    expect(signals).toHaveLength(2)
    expect(signals[0].aborted).toBe(true)
    // The current request should still be in flight (not aborted).
    expect(signals[1].aborted).toBe(false)
  })

  it('does not render any study material when the response body is unusable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] })
    )
    const user = userEvent.setup()
    render(<App />)

    await generateNotes(user, 'React')

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('The AI returned an unexpected response. Please try again.')).toBeInTheDocument()
  })
})
