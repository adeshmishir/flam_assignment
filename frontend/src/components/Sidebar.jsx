import { useState } from 'react'
import { BookOpen, BrainCircuit, Clock, RotateCcw, Trash2 } from 'lucide-react'

const PROFILE_NAMES = ['Aarav', 'Maya', 'Leo', 'Sam', 'Priya', 'Iris']

function formatTime(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) {
    return 'just now'
  }
  if (minutes < 60) {
    return `${minutes}m ago`
  }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }
  const days = Math.floor(hours / 24)
  if (days < 30) {
    return `${days}d ago`
  }
  return new Date(timestamp).toLocaleDateString()
}

function Sidebar({ sessions, onLoadSession, onDeleteSession, hasMaterial, onStartOver }) {
  const [profileIndex] = useState(() => {
    const saved = window.localStorage.getItem('studymate:profile')
    if (saved !== null) {
      const index = Number(saved)
      if (Number.isInteger(index) && index >= 0 && index < PROFILE_NAMES.length) {
        return index
      }
    }
    const index = Math.floor(Math.random() * PROFILE_NAMES.length)
    window.localStorage.setItem('studymate:profile', String(index))
    return index
  })
  const profileName = PROFILE_NAMES[profileIndex]

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-2 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Sessions
        </p>
        {sessions.length > 0 && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            {sessions.length}
          </span>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col gap-2 px-4 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-blue-500/10 dark:from-indigo-500/25 dark:to-blue-500/15">
            <BookOpen className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No sessions yet</p>
          <p className="text-xs leading-relaxed text-slate-400 dark:text-slate-500">
            Generated study material is saved here automatically.
          </p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-2 py-1 dark:divide-slate-800">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="group flex items-center gap-2 rounded-lg px-2 transition hover:bg-slate-100 dark:hover:bg-slate-800/60"
            >
              <button
                type="button"
                onClick={() => onLoadSession(session)}
                aria-label={`Load session ${session.title}`}
                className="flex min-w-0 flex-1 flex-col items-start gap-0.5 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="w-full truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {session.title}
                </span>
                <span className="flex w-full items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {formatTime(session.createdAt)}
                  {session.prompt ? (
                    <span className="truncate">· {session.prompt.slice(0, 40)}</span>
                  ) : null}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteSession(session.id)}
                aria-label={`Delete session ${session.title}`}
                className="flex-none rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {hasMaterial && (
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start over
          </button>
        </div>
      )}

      <div className="flex items-center gap-2.5 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm shadow-indigo-600/30">
          <BrainCircuit className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {profileName}
          </p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">Study locally</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar