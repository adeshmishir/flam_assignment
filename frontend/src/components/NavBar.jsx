import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BrainCircuit,
  FolderOpen,
  Menu,
  Moon,
  Plus,
  RotateCcw,
  Sun,
  X,
} from 'lucide-react'
import SessionsPanel from './SessionsPanel.jsx'

function LogoMark() {
  return (
    <motion.span
      whileHover={{ scale: 1.05, rotate: -3 }}
      whileTap={{ scale: 0.95 }}
      className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 shadow-lg shadow-indigo-600/30 ring-1 ring-white/25"
    >
      <BrainCircuit className="h-5 w-5 text-white" aria-hidden="true" />
    </motion.span>
  )
}

const actionButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-300 hover:bg-white hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800 dark:hover:text-indigo-300'

function NavBar({
  hasMaterial,
  onStartOver,
  theme,
  onToggleTheme,
  sessions,
  onLoadSession,
  onDeleteSession,
}) {
  const [showSessions, setShowSessions] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const onClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const loadSession = (session) => {
    closeMenu()
    onLoadSession(session)
  }

  const handleStartOver = () => {
    closeMenu()
    onStartOver()
  }

  return (
    <motion.nav
      ref={navRef}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass sticky top-0 z-40 border-b border-white/60 dark:border-slate-800/70"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">
              StudyMate
            </p>
            <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
              AI study companion
            </p>
          </div>
        </div>

        <div className="flex flex-none items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Ready
          </span>

          <div className="relative hidden sm:block">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowSessions((prev) => !prev)}
              aria-expanded={showSessions}
              aria-haspopup="dialog"
              className={actionButtonClass}
            >
              <FolderOpen className="h-4 w-4" aria-hidden="true" />
              <span>Sessions</span>
              {sessions.length > 0 && (
                <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {sessions.length}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showSessions && (
                <SessionsPanel
                  sessions={sessions}
                  onLoad={loadSession}
                  onDelete={onDeleteSession}
                  onClose={() => setShowSessions(false)}
                />
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-300 hover:bg-white hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-amber-300 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <div className="hidden sm:block">
            {hasMaterial ? (
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStartOver}
                className={actionButtonClass}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>Start over</span>
              </motion.button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                New topic ready
              </span>
            )}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowSessions(false)
              setMenuOpen((prev) => !prev)
            }}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-300 hover:bg-white hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800 sm:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex"
              >
                {menuOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-slate-200/80 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 sm:hidden"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSessions((prev) => !prev)}
                aria-expanded={showSessions}
                aria-haspopup="dialog"
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-white hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800"
              >
                <span className="inline-flex items-center gap-2.5">
                  <FolderOpen className="h-4 w-4" aria-hidden="true" />
                  Sessions
                </span>
                {sessions.length > 0 && (
                  <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {sessions.length}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showSessions && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SessionsPanel
                      embedded
                      sessions={sessions}
                      onLoad={loadSession}
                      onDelete={onDeleteSession}
                      onClose={() => setShowSessions(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {hasMaterial ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartOver}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-white hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Start over
                </motion.button>
              ) : (
                <span className="inline-flex w-full items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
                  <Plus className="h-4 w-4 flex-none" aria-hidden="true" />
                  Enter notes above to create study material
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default NavBar