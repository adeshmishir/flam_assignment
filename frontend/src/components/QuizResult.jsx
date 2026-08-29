import { motion } from 'framer-motion'
import { PartyPopper, RotateCcw, Target } from 'lucide-react'

function QuizResult({ score, total, retry, originalScore, originalTotal, onRetry }) {
  const incorrect = total - score
  const perfect = total > 0 && score === total

  if (retry) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Retry Complete!</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">You scored</p>
        <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
          {score} <span className="text-xl font-medium text-slate-400 dark:text-slate-500">/ {total}</span>
        </p>
        <div className="mt-1 flex gap-6 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Correct: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{score}</span>
          </p>
          <p>
            Incorrect: <span className="font-semibold text-rose-600 dark:text-rose-400">{incorrect}</span>
          </p>
        </div>
        {typeof originalScore === 'number' && (
          <p className="mt-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Original Score: {originalScore} / {originalTotal}
          </p>
        )}
      </motion.div>
    )
  }

  const headline = perfect ? 'Perfect Score!' : 'Quiz Complete!'
  const message = perfect
    ? 'You got every question correct. Great job!'
    : 'Review your wrong answers to keep improving.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {perfect ? (
        <PartyPopper className="h-7 w-7 text-emerald-500" aria-hidden="true" />
      ) : (
        <Target className="h-7 w-7 text-indigo-500" aria-hidden="true" />
      )}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{headline}</h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">You scored</p>
      <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
        {score} <span className="text-xl font-medium text-slate-400 dark:text-slate-500">/ {total}</span>
      </p>
      <div className="mt-1 flex gap-6 text-sm text-slate-600 dark:text-slate-300">
        <p>
          Correct: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{score}</span>
        </p>
        <p>
          Incorrect: <span className="font-semibold text-rose-600 dark:text-rose-400">{incorrect}</span>
        </p>
      </div>
      {!perfect && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retry Wrong Answers
        </button>
      )}
      {perfect && (
        <p className="mt-1 font-medium text-slate-700 dark:text-slate-300">{message}</p>
      )}
    </motion.div>
  )
}

export default QuizResult