import { motion } from 'framer-motion'
import { BookOpen, Brain, Sparkles } from 'lucide-react'

function EmptyState() {
  return (
    <section aria-label="Empty state" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-10 text-center shadow-sm backdrop-blur sm:p-14">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-transparent to-violet-50/60" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative mx-auto flex h-24 w-24 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-500/15 blur-md" aria-hidden="true" />
        <span className="absolute h-4 w-4 rounded-full bg-violet-400/40 animate-blob" aria-hidden="true" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30">
          <Brain className="h-10 w-10 text-white animate-float" aria-hidden="true" />
        </span>
        <Sparkles className="absolute -top-1 -right-2 h-6 w-6 text-amber-400 animate-pulse-soft" aria-hidden="true" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        className="relative"
      >
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          Start Learning
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600">
          Ready to start learning? Add your notes above and let AI create
          personalized flashcards and quiz questions.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="relative mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 shadow-sm"
      >
        <BookOpen className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
        No study material yet
      </motion.p>
    </section>
  )
}

export default EmptyState