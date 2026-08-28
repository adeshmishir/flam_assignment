const API_BASE = '/api'

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
