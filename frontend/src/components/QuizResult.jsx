import { motion } from 'framer-motion'
import { PartyPopper, RotateCcw, Target } from 'lucide-react'

function ScoreChip({ perfect }) {
  const icon = perfect ? (
    <PartyPopper className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
  ) : (
    <Target className="h-5 w-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
  )

  return (
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
        perfect
          ? 'bg-emerald-50 dark:bg-emerald-500/10'
          : 'bg-amber-50 dark:bg-amber-500/10'
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
    'relative overflow-hidden rounded-2xl border border-stone-200/70 bg-paper/70 px-5 py-6 text-center shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70'
  const accent = (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-amber-600/60 via-amber-500/50 to-amber-600/60 opacity-70"
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
        <span className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(180,83,9,0.06),transparent)]" />
        <h3 className="text-base font-bold text-stone-900 dark:text-white">Retry Complete!</h3>
        <p className="mt-1.5 text-sm font-medium text-stone-500 dark:text-stone-400">You scored</p>
        <p className="mt-1 text-3xl font-extrabold text-stone-900 dark:text-white">
          {score} <span className="text-lg font-medium text-stone-400 dark:text-stone-500">/ {total}</span>
        </p>
        <div className="mt-1.5 flex gap-5 text-sm text-stone-600 dark:text-stone-300">
          <p>
            Correct: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{score}</span>
          </p>
          <p>
            Incorrect: <span className="font-semibold text-rose-600 dark:text-rose-400">{incorrect}</span>
          </p>
        </div>
        {typeof originalScore === 'number' && (
          <p className="mt-2.5 inline-block rounded-full border border-stone-200/80 bg-white/60 px-2.5 py-1 text-xs font-medium text-stone-500 dark:border-stone-700 dark:bg-paper-soft-dark/70 dark:text-stone-400">
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
      <span className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(180,83,9,0.06),transparent)]" />
      <ScoreChip perfect={perfect} />
      <h3 className="mt-2.5 text-base font-bold text-stone-900 dark:text-white">{headline}</h3>
      <p className="mt-1.5 text-sm font-medium text-stone-500 dark:text-stone-400">You scored</p>
      <p className="mt-1 text-3xl font-extrabold text-stone-900 dark:text-white">
        {score} <span className="text-lg font-medium text-stone-400 dark:text-stone-500">/ {total}</span>
      </p>
      <div className="mt-1.5 flex gap-5 text-sm text-stone-600 dark:text-stone-300">
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
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-paper transition hover:bg-amber-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-paper-dark"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retry Wrong Answers
        </button>
      )}
      {perfect && (
        <p className="mt-2 font-medium text-stone-700 dark:text-stone-300">{message}</p>
      )}
    </motion.div>
  )
}

export default QuizResult