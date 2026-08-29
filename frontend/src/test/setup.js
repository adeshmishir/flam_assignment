import '@testing-library/jest-dom/vitest'

// The following shims keep framer-motion and scroll-reveal helpers happy
// inside jsdom, which does not implement these browser APIs natively.

if (typeof globalThis.matchMedia !== 'function') {
  globalThis.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

if (typeof globalThis.IntersectionObserver !== 'function') {
  globalThis.IntersectionObserver = class IntersectionObserverShim {
    constructor(callback, options) {
      this.callback = callback
      this.options = options
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
}

if (typeof globalThis.ResizeObserver !== 'function') {
  globalThis.ResizeObserver = class ResizeObserverShim {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 16)
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
}

if (typeof globalThis.cancelAnimationFrame !== 'function') {
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
}