import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw } from 'lucide-react'

function ErrorState({ message, onRetry }) {
  return (
    <motion.section
      role="alert"
      aria-live="assertive"
      aria-label="Error"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-50/90 to-rose-50/70 p-8 text-center shadow-sm dark:border-red-500/30 dark:from-red-950/40 dark:to-rose-950/40 sm:p-10"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg shadow-red-500/30">
        <AlertTriangle className="h-7 w-7 text-white" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-red-900 dark:text-red-300">
        Something went wrong
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-red-700 dark:text-red-200/90">
        {message || 'Unable to generate your study material. Please try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Try Again
      </button>
    </motion.section>
  )
}

export default ErrorState