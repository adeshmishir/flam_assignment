import { useCallback, useEffect, useState } from 'react'

const SESSIONS_KEY = 'studyMate.sessions'
const MAX_SESSIONS = 12

function loadSessions() {
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function makeId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `session-${Date.now()}`
}

/**
 * Session persistence for study material. Sessions are stored in localStorage
 * (newest first, capped at MAX_SESSIONS) so users can reload previous results.
 */
export function useSessions() {
  const [sessions, setSessions] = useState(loadSessions)

  useEffect(() => {
    try {
      window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)))
    } catch {
      /* storage may be unavailable */
    }
  }, [sessions])

  const saveSession = useCallback((data, prompt = '') => {
    if (!data) {
      return null
    }
    const session = {
      id: makeId(),
      title: data.title || 'Untitled session',
      prompt: typeof prompt === 'string' ? prompt : '',
      data,
      createdAt: Date.now(),
    }
    setSessions((prev) => [session, ...prev].slice(0, MAX_SESSIONS))
    return session.id
  }, [])

  const deleteSession = useCallback((id) => {
    setSessions((prev) => prev.filter((session) => session.id !== id))
  }, [])

  return { sessions, saveSession, deleteSession }
}