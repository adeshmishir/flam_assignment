import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  CheckCircle,
  ClipboardCheck,
  LayoutGrid,
  Layers,
  Loader2,
} from 'lucide-react'

const STEPS = [
  { label: 'Understanding your topic', icon: Brain },
  { label: 'Organizing key concepts', icon: Layers },
  { label: 'Generating flashcards', icon: LayoutGrid },
  { label: 'Preparing your quiz', icon: ClipboardCheck },
]

const STEP_TIME = 900

function LoadingState({ streamText }) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, STEP_TIME)
    return () => clearInterval(id)
  }, [])

  const hasStreamText = typeof streamText === 'string' && streamText.length > 0

  return (
    <section
      aria-live="polite"
      aria-busy="true"
      aria-label="Generating study material"
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:p-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-violet-50/50 dark:from-indigo-500/10 dark:via-transparent dark:to-violet-500/10" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30">
          <Brain className="h-7 w-7 text-white animate-pulse-soft" aria-hidden="true" />
          <span className="absolute -inset-2 rounded-2xl border-2 border-indigo-200/70 animate-ping" aria-hidden="true" />
        </div>

        <h2 className="mt-6 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Generating your study material...
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This may take a few seconds.</p>

        <div className="mt-7 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: STEP_TIME * STEPS.length / 1000, ease: 'linear' }}
            className="shimmer-fill h-1.5 rounded-full"
          />
        </div>

        <ul className="mt-7 w-full space-y-3">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            const isDone = index < activeStep
            const isActive = index === activeStep
            return (
              <motion.li
                key={step.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08, ease: 'easeOut' }}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/70 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-800/60"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700">
                  {isDone ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  ) : (
                    <StepIcon className="h-5 w-5 text-slate-300 dark:text-slate-600" aria-hidden="true" />
                  )}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isDone
                      ? 'text-slate-500 dark:text-slate-400'
                      : isActive
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </motion.li>
            )
          })}
        </ul>
      </div>

      {hasStreamText && (
        <div className="relative mt-7 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Live preview
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
              streaming
            </span>
          </div>
          <pre className="max-h-44 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs leading-relaxed text-emerald-300/90">
            {streamText}
          </pre>
        </div>
      )}
    </section>
  )
}

export default LoadingState