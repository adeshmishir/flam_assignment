import { motion } from 'framer-motion'
import { ArrowUpRight, MousePointerClick } from 'lucide-react'

function Flashcard({ card, isFlipped, onFlip }) {
  if (!card) {
    return null
  }

  return (
    <div className="relative">
      <div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-500/25 via-violet-400/10 to-fuchsia-500/25 opacity-70 blur-lg"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={onFlip}
        aria-label="Flip card"
        aria-pressed={isFlipped}
        className="group relative block w-full rounded-3xl border border-slate-200 bg-white p-1 text-left shadow-sm transition hover:shadow-xl hover:shadow-indigo-900/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/40"
        style={{ perspective: '1400px' }}
      >
        <motion.div
          key={isFlipped ? 'back' : 'front'}
          initial={{ opacity: 0, rotateY: 70, y: 10 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-80 flex-col items-center justify-center rounded-[20px] bg-gradient-to-b from-white to-slate-50/80 px-5 py-8 text-center sm:min-h-96 sm:px-8"
        >
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
              isFlipped
                ? 'bg-violet-100 text-violet-700'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {isFlipped ? 'Answer' : 'Question'}
          </span>

          <p className="mt-6 text-lg leading-relaxed text-slate-800 sm:text-xl">
            {isFlipped ? card.answer : card.question}
          </p>

          <span className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-400 transition group-hover:border-indigo-200 group-hover:text-indigo-500">
            {isFlipped ? (
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Click to {isFlipped ? 'show question' : 'reveal answer'}
          </span>
        </motion.div>
      </button>
    </div>
  )
}

export default Flashcard