import { motion } from 'framer-motion'
import { PartyPopper, RotateCcw, Target } from 'lucide-react'

function QuizResult({ score, total, retry, originalScore, originalTotal, onRetry }) {
  const incorrect = total - score
  const perfect = total > 0 && score === total

  if (retry) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur sm:p-10"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/60 via-transparent to-indigo-50/60"
          aria-hidden="true"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/25">
          <RotateCcw className="h-7 w-7 text-white" aria-hidden="true" />
        </span>
        <h3 className="relative mt-1 text-xl font-bold tracking-tight text-slate-900">
          Retry Complete!
        </h3>
        <p className="relative text-sm font-semibold uppercase tracking-wider text-slate-500">
          You scored
        </p>
        <p className="relative text-5xl font-extrabold text-transparent bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text">
          {score} <span className="align-baseline text-2xl font-medium text-slate-400">/ {total}</span>
        </p>
        <div className="relative mt-1 flex gap-6 text-sm text-slate-600">
          <p>
            Correct: <span className="font-bold text-emerald-600">{score}</span>
          </p>
          <p>
            Incorrect: <span className="font-bold text-rose-600">{incorrect}</span>
          </p>
        </div>
        {typeof originalScore === 'number' && (
          <p className="relative rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-500">
            Original Score: {originalScore} / {originalTotal}
          </p>
        )}
        <p className="relative mt-1 font-medium text-slate-700">
          {perfect ? 'Great job!' : 'Keep practicing!'}
        </p>
      </motion.div>
    )
  }

  const headline = perfect ? 'Perfect Score!' : 'Quiz Complete!'
  const message = perfect
    ? 'You got every question correct. Great job!'
    : 'Review your wrong answers to keep improving.'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur sm:p-10"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-transparent to-indigo-50/60"
        aria-hidden="true"
      />
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg ${
          perfect
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25'
            : 'bg-gradient-to-br from-indigo-600 to-violet-600 shadow-indigo-600/25'
        }`}
      >
        {perfect ? (
          <PartyPopper className="h-7 w-7 text-white" aria-hidden="true" />
        ) : (
          <Target className="h-7 w-7 text-white" aria-hidden="true" />
        )}
      </span>
      <h3 className="relative mt-1 text-xl font-bold tracking-tight text-slate-900">
        {headline}
      </h3>
      <p className="relative text-sm font-semibold uppercase tracking-wider text-slate-500">
        You scored
      </p>
      <p className="relative text-5xl font-extrabold text-transparent bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text">
        {score} <span className="align-baseline text-2xl font-medium text-slate-400">/ {total}</span>
      </p>
      <div className="relative mt-1 flex gap-6 text-sm text-slate-600">
        <p>
          Correct: <span className="font-bold text-emerald-600">{score}</span>
        </p>
        <p>
          Incorrect: <span className="font-bold text-rose-600">{incorrect}</span>
        </p>
      </div>
      {!perfect && (
        <button
          type="button"
          onClick={onRetry}
          className="relative mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retry Wrong Answers
        </button>
      )}
      {perfect && <p className="relative mt-1 font-medium text-slate-700">{message}</p>}
    </motion.div>
  )
}

export default QuizResult