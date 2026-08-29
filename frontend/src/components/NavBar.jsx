import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import LogoMark from './LogoMark.jsx'

const iconButtonClass =
  'inline-flex items-center justify-center rounded-lg border border-stone-200/80 bg-white/70 p-2 text-stone-600 transition hover:border-amber-500/60 hover:bg-white hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 dark:border-stone-700 dark:bg-paper-dark/70 dark:text-stone-200 dark:hover:border-amber-500/40 dark:hover:bg-paper-soft-dark dark:hover:text-amber-500'

function NavBar({
  drawerOpen,
  onToggleDrawer,
  theme,
  onToggleTheme,
}) {
  return (
    <nav
      className="sticky top-0 z-40 border-b border-stone-200/70 bg-paper/80 backdrop-blur-sm dark:border-stone-800/70 dark:bg-paper-dark/80"
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold tracking-tight text-stone-900 dark:text-white">
              StudyMate
            </p>
            <p className="hidden truncate text-xs text-stone-500 dark:text-stone-400 sm:block">
              Study Assistant
            </p>
          </div>
        </div>

        <div className="flex flex-none items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={iconButtonClass}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
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

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onToggleDrawer}
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            className={`${iconButtonClass} lg:hidden`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={drawerOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex"
              >
                {drawerOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar