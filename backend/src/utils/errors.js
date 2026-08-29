export class LlmConfigError extends Error {
  constructor(message) {
    super(message)
    this.name = 'LlmConfigError'
  }
}

export class LlmEmptyResponseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'LlmEmptyResponseError'
  }
}

export class LlmInvalidJsonError extends Error {
  constructor(message) {
    super(message)
    this.name = 'LlmInvalidJsonError'
  }
}

export class LlmValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'LlmValidationError'
  }
}

/**
 * Maps an LLM failure to a safe, user-friendly payload for HTTP responses.
 * Returns `null` for errors that should be treated as internal/unknown.
 */
export function llmErrorInfo(error) {
  if (error instanceof LlmConfigError) {
    return { error: 'The AI service is not configured.', code: 'LLM_CONFIG' }
  }
  if (error instanceof LlmEmptyResponseError) {
    return { error: 'The AI returned an empty response. Please try again.', code: 'LLM_EMPTY_RESPONSE' }
  }
  if (error instanceof LlmInvalidJsonError) {
    return { error: 'The AI returned invalid data. Please try again.', code: 'LLM_INVALID_JSON' }
  }
  if (error instanceof LlmValidationError) {
    return { error: 'The AI returned an unexpected format. Please try again.', code: 'LLM_INVALID_RESPONSE' }
  }
  if (error && error.status) {
    return { error: 'The AI provider is unavailable. Please try again.', code: 'UPSTREAM_ERROR' }
  }
  return null
}

export function llmErrorMessage(error, fallback = 'Sorry, something went wrong. Please try again.') {
  const info = llmErrorInfo(error)
  return info ? info.error : fallback
}