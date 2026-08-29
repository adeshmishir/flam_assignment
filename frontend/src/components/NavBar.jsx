import { motion } from 'framer-motion'
import { GraduationCap, Plus, RotateCcw } from 'lucide-react'

function NavBar({ hasMaterial, onStartOver }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass sticky top-0 z-40 border-b border-white/60"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/30">
            <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold tracking-tight text-slate-900">
              StudyMate
            </p>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              AI flashcards & quizzes
            </p>
          </div>
        </div>

        <div className="flex flex-none items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Ready
          </span>
          {hasMaterial ? (
            <button
              type="button"
              onClick={onStartOver}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Start over</span>
              <span className="sr-only sm:hidden">Start over</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New topic ready
            </span>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default NavBar