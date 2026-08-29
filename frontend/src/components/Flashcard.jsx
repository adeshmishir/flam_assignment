import { motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'

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
      className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40 dark:hover:shadow-black/40"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 opacity-70"
      />
      <motion.div
        key={isFlipped ? 'back' : 'front'}
        initial={{ rotateY: -80, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        style={{ transformPerspective: 900 }}
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

        <span className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 transition group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400">
          <RotateCw
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180"
            aria-hidden="true"
          />
          {isFlipped ? 'Show question' : 'Reveal answer'}
        </span>
      </motion.div>
    </button>
  )
}

export default Flashcard