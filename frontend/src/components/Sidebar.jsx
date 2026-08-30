import { useRef, useState } from 'react'
import {
  BookOpen,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Clock,
  Repeat,
  RotateCcw,
  Trash2,
} from 'lucide-react'

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

function Sidebar({
  sessions,
  onLoadSession,
  onDeleteSession,
  hasMaterial,
  onStartOver,
}) {
  const [profileIndex, setProfileIndex] = useState(() => {
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
  const [profileOpen, setProfileOpen] = useState(false)
  const profileName = PROFILE_NAMES[profileIndex]
  const sessionButtonRefs = useRef([])

  const cycleProfile = () => {
    setProfileIndex((prev) => {
      const next = (prev + 1) % PROFILE_NAMES.length
      window.localStorage.setItem('studymate:profile', String(next))
      return next
    })
  }

  const stats = {
    sessions: sessions.length,
    flashcards: sessions.reduce(
      (sum, session) => sum + (Array.isArray(session.data?.flashcards) ? session.data.flashcards.length : 0),
      0
    ),
    quiz: sessions.reduce(
      (sum, session) => sum + (Array.isArray(session.data?.quiz) ? session.data.quiz.length : 0),
      0
    ),
  }

  const handleSessionsKeyDown = (event) => {
    if (sessions.length === 0) {
      return
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      return
    }
    event.preventDefault()
    const currentIndex = sessionButtonRefs.current.findIndex((el) => el === document.activeElement)
    let nextIndex
    if (event.key === 'ArrowDown') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % sessions.length
    } else {
      nextIndex =
        currentIndex === -1 ? sessions.length - 1 : (currentIndex - 1 + sessions.length) % sessions.length
    }
    sessionButtonRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-5">
        <div className="flex min-w-0 items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Sessions
          </p>
          {sessions.length > 0 && (
            <span className="rounded-full border border-stone-200/80 bg-white/60 px-2 py-0.5 text-xs font-semibold text-stone-500 dark:border-stone-700 dark:bg-paper-soft-dark dark:text-stone-400">
              {sessions.length}
            </span>
          )}
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-1 flex-col gap-2 px-4 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-700/10 dark:bg-amber-500/10">
            <BookOpen className="h-4.5 w-4.5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium text-stone-600 dark:text-stone-300">No sessions yet</p>
          <p className="text-xs leading-relaxed text-stone-400 dark:text-stone-500">
            Generated study material is saved here automatically.
          </p>
        </div>
      ) : (
        <ul
          onKeyDown={handleSessionsKeyDown}
          className="flex-1 divide-y divide-stone-200/70 overflow-y-auto px-2 py-1 [scrollbar-width:none] dark:divide-stone-800/70 [&::-webkit-scrollbar]:hidden"
        >
          {sessions.map((session, index) => (
            <li
              key={session.id}
              className="group flex items-center gap-2 rounded-lg px-2 transition hover:bg-stone-200/40 dark:hover:bg-stone-800/40"
            >
              <button
                type="button"
                ref={(el) => {
                  sessionButtonRefs.current[index] = el
                }}
                onClick={() => onLoadSession(session)}
                aria-label={`Load session ${session.title}`}
                className="flex min-w-0 flex-1 flex-col items-start gap-0.5 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60"
              >
                <span className="w-full truncate text-sm font-semibold text-stone-800 dark:text-stone-100">
                  {session.title}
                </span>
                <span className="flex w-full items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500">
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
                className="flex-none rounded-lg p-2 text-stone-400 transition hover:bg-rose-100/60 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-stone-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {hasMaterial && (
        <div className="border-t border-stone-200/70 p-3 dark:border-stone-800/70">
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-stone-200/80 bg-white/70 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-500/60 hover:bg-white hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 dark:border-stone-700 dark:bg-paper-dark/70 dark:text-stone-200 dark:hover:border-amber-500/40 dark:hover:bg-paper-soft-dark dark:hover:text-amber-500"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start over
          </button>
        </div>
      )}

      <div className="border-t border-stone-200/70 dark:border-stone-800/70">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={cycleProfile}
            aria-label="Switch learner profile"
            title="Click to switch learner"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60"
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-amber-600 text-white shadow-paper">
              <BrainCircuit className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-sm font-semibold text-stone-800 dark:text-stone-100">
                  {profileName}
                </span>
                <Repeat className="h-3 w-3 flex-none text-amber-600 dark:text-amber-500" aria-hidden="true" />
              </span>
              <span className="block truncate text-xs text-stone-400 dark:text-stone-500">
                Click to switch learner
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-label={profileOpen ? 'Hide profile stats' : 'Show profile stats'}
            className="flex-none rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-200/50 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            {profileOpen ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {profileOpen && (
          <div className="grid grid-cols-3 gap-2 border-t border-stone-200/70 px-4 py-3 dark:border-stone-800/70">
            {[
              { label: 'Sessions', value: stats.sessions },
              { label: 'Flashcards', value: stats.flashcards },
              { label: 'Quiz', value: stats.quiz },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-stone-200/70 bg-white/60 px-2 py-2 text-center dark:border-stone-800/70 dark:bg-paper-dark/60"
              >
                <p className="text-base font-bold text-stone-800 dark:text-white">{stat.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400 dark:text-stone-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar