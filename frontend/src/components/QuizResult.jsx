import { motion } from 'framer-motion'
import { PartyPopper, RotateCcw, Target } from 'lucide-react'

function ScoreChip({ perfect }) {
  const icon = perfect ? (
    <PartyPopper className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
  ) : (
    <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
  )

  return (
    <span
      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
        perfect
          ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10'
          : 'bg-gradient-to-br from-indigo-500/20 to-blue-500/10'
      }`}
    >
      {icon}
    </span>
  )
}

function QuizResult({ score, total, retry, originalScore, originalTotal, onRetry }) {
  const incorrect = total - score
  const perfect = total > 0 && score === total

  const cardClass =
    'relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900'
  const accent = (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 opacity-60"
    />
  )

  if (retry) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cardClass}
      >
        {accent}
        <span className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.06),transparent)]" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Retry Complete!</h3>
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">You scored</p>
        <p className="mt-1 text-4xl font-extrabold text-slate-900 dark:text-white">
          {score} <span className="text-xl font-medium text-slate-400 dark:text-slate-500">/ {total}</span>
        </p>
        <div className="mt-2 flex gap-6 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Correct: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{score}</span>
          </p>
          <p>
            Incorrect: <span className="font-semibold text-rose-600 dark:text-rose-400">{incorrect}</span>
          </p>
        </div>
        {typeof originalScore === 'number' && (
          <p className="mt-3 inline-block rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400">
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
      className={cardClass}
    >
      {accent}
      <span className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.06),transparent)]" />
      <ScoreChip perfect={perfect} />
      <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{headline}</h3>
      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">You scored</p>
      <p className="mt-1 text-4xl font-extrabold text-slate-900 dark:text-white">
        {score} <span className="text-xl font-medium text-slate-400 dark:text-slate-500">/ {total}</span>
      </p>
      <div className="mt-2 flex gap-6 text-sm text-slate-600 dark:text-slate-300">
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
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-blue-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retry Wrong Answers
        </button>
      )}
      {perfect && (
        <p className="mt-2 font-medium text-slate-700 dark:text-slate-300">{message}</p>
      )}
    </motion.div>
  )
}

export default QuizResult