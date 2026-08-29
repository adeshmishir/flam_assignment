import { AlertTriangle, RotateCcw } from 'lucide-react'

function ErrorState({ message, onRetry }) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      aria-label="Error"
      className="rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-8 text-center dark:border-rose-500/30 dark:bg-rose-950/20"
    >
      <AlertTriangle
        className="mx-auto h-8 w-8 text-rose-600 dark:text-rose-400"
        aria-hidden="true"
      />
      <h2 className="mt-3 text-base font-semibold text-rose-900 dark:text-rose-200">
        Something went wrong
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-rose-700 dark:text-rose-200/80">
        {message || 'Unable to generate your study material. Please try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Try Again
      </button>
    </section>
  )
}

export default ErrorState