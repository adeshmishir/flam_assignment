import { motion } from 'framer-motion'
import { BrainCircuit, Loader2 } from 'lucide-react'

function LoadingState({ streamText }) {
  const hasStreamText = typeof streamText === 'string' && streamText.trim().length > 0

  return (
    <section
      aria-live="polite"
      aria-busy="true"
      aria-label="Generating study material"
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:py-12"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent"
      />
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(99,102,241,0.9), rgba(59,130,246,0.35) 40%, rgba(30,58,138,0) 60%, rgba(99,102,241,0.9))',
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          />
          <span aria-hidden="true" className="absolute inset-[3px] rounded-full bg-white dark:bg-slate-900" />
          <BrainCircuit
            className="relative h-7 w-7 text-indigo-600 dark:text-indigo-400"
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
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
          <span className="animate-indeterminate block h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />
        </div>

        {hasStreamText && (
          <div className="mt-6 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 dark:border-slate-800">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" aria-hidden="true" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Live preview</p>
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