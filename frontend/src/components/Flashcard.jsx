import { motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'

function Flashcard({ card, isFlipped, onFlip, buttonRef }) {
  if (!card) {
    return null
  }

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={onFlip}
      aria-label="Flip card"
      aria-pressed={isFlipped}
      className="group relative block w-full overflow-hidden rounded-2xl border border-stone-200/70 bg-paper/70 text-left shadow-paper transition hover:border-amber-500/50 hover:bg-white/80 hover:shadow-paper-focus lg:hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 dark:border-stone-700/60 dark:bg-paper-dark/70 dark:hover:border-amber-500/40 dark:hover:bg-paper-dark"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-amber-600/70 via-amber-500/60 to-amber-600/70 opacity-70"
      />
      <motion.div
        key={isFlipped ? 'back' : 'front'}
        initial={{ rotateY: -80, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        style={{ transformPerspective: 900 }}
        className="flex min-h-44 flex-col items-center justify-center px-5 py-5 text-center sm:min-h-52"
      >
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            isFlipped
              ? 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
              : 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400'
          }`}
        >
          {isFlipped ? 'Answer' : 'Question'}
        </span>

        <p className="mt-3 max-w-lg text-sm leading-snug text-stone-800 dark:text-stone-100 sm:text-base">
          {isFlipped ? card.answer : card.question}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-stone-400 transition group-hover:text-stone-600 dark:text-stone-500 dark:group-hover:text-stone-400">
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