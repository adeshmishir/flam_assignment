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
