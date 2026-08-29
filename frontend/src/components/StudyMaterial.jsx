import { motion } from 'framer-motion'
import FlashcardSection from './FlashcardSection.jsx'
import QuizSection from './QuizSection.jsx'
import BlockRenderer from './BlockRenderer.jsx'
import RefinePanel from './RefinePanel.jsx'

function StudyMaterial({ data, onRefine, isRefining, refineError }) {
  const hasBlocks = Array.isArray(data.blocks) && data.blocks.length > 0

  return (
    <motion.section
      aria-label="Study material"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col gap-8"
    >
      <section
        aria-label="Summary"
        className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-7 sm:py-7"
      >
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {data.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          {data.summary}
        </p>
      </section>

      {hasBlocks && (
        <section aria-label="Key insights" className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Key insights
          </h3>
          <BlockRenderer blocks={data.blocks} />
        </section>
      )}

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <FlashcardSection flashcards={data.flashcards} />
        </div>
        <div className="min-w-0">
          <QuizSection quiz={data.quiz} />
        </div>
      </div>

      <RefinePanel onRefine={onRefine} isRefining={isRefining} error={refineError} />
    </motion.section>
  )
}

export default StudyMaterial