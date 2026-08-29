import { Loader2 } from 'lucide-react'

function LoadingState({ streamText }) {
  const hasStreamText = typeof streamText === 'string' && streamText.trim().length > 0

  return (
    <section
      aria-live="polite"
      aria-busy="true"
      aria-label="Generating study material"
      className="rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:py-12"
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
          <Loader2 className="h-5 w-5 animate-spin text-white" aria-hidden="true" />
        </div>

        <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
          Generating your study material...
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          This usually takes a few seconds.
        </p>

        <div
          className="mt-6 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-label="Generating study material"
        >
          <span className="animate-indeterminate block h-full w-1/3 rounded-full bg-indigo-500" />
        </div>

        {hasStreamText && (
          <div className="mt-6 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-100 px-4 py-2 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Live preview
              </p>
            </div>
            <pre className="max-h-44 overflow-auto whitespace-pre-wrap break-words px-4 py-3 text-left font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {streamText}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}

export default LoadingState