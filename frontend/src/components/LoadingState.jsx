import { motion } from 'framer-motion'
import { BrainCircuit, Loader2 } from 'lucide-react'

function LoadingState({ streamText }) {
  const hasStreamText = typeof streamText === 'string' && streamText.trim().length > 0

  return (
    <section
      aria-live="polite"
      aria-busy="true"
      aria-label="Generating study material"
      className="relative overflow-hidden rounded-2xl border border-stone-200/70 bg-paper/70 px-6 py-10 shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70 sm:py-12"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"
      />
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(217,119,6,0.9), rgba(245,158,11,0.35) 40%, rgba(120,80,20,0) 60%, rgba(217,119,6,0.9))',
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-[3px] rounded-full bg-paper dark:bg-paper-dark"
          />
          <BrainCircuit
            className="relative h-7 w-7 text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-5 text-base font-semibold text-stone-900 dark:text-white">
          Generating your study material...
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          This usually takes a few seconds.
        </p>

        <div
          className="mt-6 h-1 w-full overflow-hidden rounded-full bg-stone-200/80 dark:bg-stone-800"
          role="progressbar"
          aria-label="Generating study material"
        >
          <span className="animate-indeterminate block h-full w-1/3 rounded-full bg-amber-600" />
        </div>

        {hasStreamText && (
          <div className="mt-6 w-full overflow-hidden rounded-xl border border-stone-200/80 dark:border-stone-700/60">
            <div className="flex items-center gap-2 border-b border-stone-200/70 px-4 py-2 dark:border-stone-800">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600" aria-hidden="true" />
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">Live preview</p>
            </div>
            <pre className="max-h-44 overflow-auto whitespace-pre-wrap break-words px-4 py-3 text-left font-mono text-xs leading-relaxed text-stone-600 dark:text-stone-300">
              {streamText}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}

export default LoadingState