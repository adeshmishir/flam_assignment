import { motion } from 'framer-motion'
import { Brain, ClipboardCheck, Sparkles, Zap } from 'lucide-react'

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

const features = [
  { icon: Brain, label: 'Smart Flashcards' },
  { icon: ClipboardCheck, label: 'Practice Quizzes' },
  { icon: Zap, label: 'Instant Generation' },
]

function Header() {
  return (
    <motion.header
      variants={container}
      initial="hidden"
      animate="visible"
      className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-10 pb-6 text-center sm:pt-16 sm:pb-8"
    >
      <motion.div
        variants={item}
        className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm backdrop-blur"
      >
        <Sparkles className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
        AI-Powered Study Assistant
      </motion.div>

      <motion.h1
        variants={item}
        className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
      >
        Turn your notes into
        <span className="mt-1 block">
          <span className="text-gradient animate-gradient-x">smarter learning.</span>
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
      >
        Paste your notes or enter any topic and instantly generate interactive
        flashcards and practice quizzes.
      </motion.p>

      <motion.ul
        variants={item}
        className="mt-7 flex w-full max-w-xl flex-col items-center justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3"
      >
        {features.map(({ icon: FeatureIcon, label }) => (
          <li
            key={label}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur sm:w-auto"
          >
            <FeatureIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            {label}
          </li>
        ))}
      </motion.ul>
    </motion.header>
  )
}

export default Header