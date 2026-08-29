import { motion } from 'framer-motion'

function Flashcard({ card, isFlipped, onFlip }) {
  if (!card) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label="Flip card"
      aria-pressed={isFlipped}
      className="block w-full rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <motion.div
        key={isFlipped ? 'back' : 'front'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex min-h-72 flex-col items-center justify-center px-6 py-8 text-center sm:min-h-80"
      >
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isFlipped
              ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
          }`}
        >
          {isFlipped ? 'Answer' : 'Question'}
        </span>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-800 dark:text-slate-100 sm:text-lg">
          {isFlipped ? card.answer : card.question}
        </p>

        <span className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          {isFlipped ? 'Show question' : 'Reveal answer'}
        </span>
      </motion.div>
    </button>
  )
}

export default Flashcard