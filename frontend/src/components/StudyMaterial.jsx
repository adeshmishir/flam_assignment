import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import ProgressiveText from './ProgressiveText.jsx'
import FlashcardSection from './FlashcardSection.jsx'
import QuizSection from './QuizSection.jsx'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function StudyMaterial({ data }) {
  return (
    <motion.section
      aria-label="Study material"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 sm:gap-8"
    >
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-md shadow-slate-900/5 backdrop-blur sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-transparent to-violet-50/70"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </span>
            Study Material
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-indigo-600">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              AI generated
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {data.title}
          </h2>

          <div className="mt-4 h-px bg-gradient-to-r from-indigo-300/70 via-slate-200 to-transparent" aria-hidden="true" />

          <ProgressiveText
            text={data.summary}
            className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg"
          />
        </div>
      </motion.div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <motion.div variants={itemVariants} className="min-w-0">
          <FlashcardSection flashcards={data.flashcards} />
        </motion.div>
        <motion.div variants={itemVariants} className="min-w-0">
          <QuizSection quiz={data.quiz} />
        </motion.div>
      </div>
    </motion.section>
  )
}

export default StudyMaterial