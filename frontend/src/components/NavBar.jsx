import { Menu, X } from 'lucide-react'
import LogoMark from './LogoMark.jsx'

const iconButtonClass =
  'inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white'

function NavBar({ drawerOpen, onToggleDrawer }) {
  return (
    <nav
      className="sticky top-0 z-40 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
              StudyMate
            </p>
            <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
              Study Assistant
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleDrawer}
          aria-expanded={drawerOpen}
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          className={iconButtonClass}
        >
          {drawerOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </nav>
  )
}

export default NavBar