import { useEffect, useState } from 'react'

const THEME_KEY = 'studyMate.theme'
const TRANSITION_MS = 350

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'dark'
  }
  try {
    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
  } catch {
    /* storage may be unavailable */
  }
  return 'dark'
}

/**
 * Toggles dark mode by adding/removing the `dark` class on <html> and keeps
 * the preference in localStorage so it survives reloads (a tiny inline script
 * in index.html applies it before paint to avoid a flash). Dark mode is the
 * default on first visit.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* storage may be unavailable */
    }
  }, [theme])

  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.add('theme-animating')
    window.setTimeout(() => {
      root.classList.remove('theme-animating')
    }, TRANSITION_MS)
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}