import { useEffect, useRef } from 'react'
import { BookOpen, Clock, FolderOpen, Trash2 } from 'lucide-react'

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

function SessionsPanel({ sessions, onLoad, onDelete, onClose, embedded = false }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const onClickOutside = (event) => {
      if (embedded) {
        return
      }
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, embedded])

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Saved sessions"
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/15 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 ${
        embedded ? 'relative mt-2 w-full' : 'absolute top-full right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)]'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <p className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          <FolderOpen className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          Saved sessions
        </p>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          {sessions.length}
        </span>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No sessions yet
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Generated material is saved automatically.
          </p>
        </div>
      ) : (
        <ul className="max-h-72 overflow-auto divide-y divide-slate-100 dark:divide-slate-800">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="group flex items-center gap-3 px-4 py-3 transition hover:bg-indigo-50/60 dark:hover:bg-slate-800/60"
            >
              <button
                type="button"
                onClick={() => onLoad(session)}
                className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label={`Load session ${session.title}`}
              >
                <span className="w-full truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {session.title}
                </span>
                <span className="flex w-full items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {formatTime(session.createdAt)}
                  {session.prompt ? (
                    <span className="truncate">· {session.prompt.slice(0, 40)}</span>
                  ) : null}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(session.id)}
                className="flex-none rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                aria-label={`Delete session ${session.title}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SessionsPanel