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
    throw new Error('Failed to reach the server. Please check your connection and try again.')
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('The server returned an unexpected response. Please try again.')
  }

  if (!response.ok) {
    const message =
      typeof data?.error === 'string' && data.error
        ? data.error
        : 'Sorry, something went wrong. Please try again.'
    throw new Error(message)
  }

  return data
}
