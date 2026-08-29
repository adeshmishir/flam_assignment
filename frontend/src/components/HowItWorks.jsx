import { motion } from 'framer-motion'
import { FileText, GraduationCap, Sparkles } from 'lucide-react'
import Reveal from './Reveal.jsx'

const STEPS = [
  {
    icon: FileText,
    step: '01',
    title: 'Add Your Notes',
    description:
      'Paste your notes or type any topic into the input box — no setup required.',
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'AI Creates Study Material',
    description:
      'The backend uses a large language model to build structured flashcards and a practice quiz.',
  },
  {
    icon: GraduationCap,
    step: '03',
    title: 'Learn and Practice',
    description:
      'Flip flashcards to review and take the quiz with instant feedback and explanations.',
  },
]

function HowItWorks() {
  return (
    <Reveal className="mt-4">
      <section aria-label="How it works" className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            How it works
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            From notes to mastery in seconds
          </h2>
        </div>

        <ol className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/8 sm:p-7"
              >
                <span
                  className="pointer-events-none absolute -top-3 -right-2 text-6xl font-extrabold text-slate-100/70 transition group-hover:text-indigo-100/70"
                  aria-hidden="true"
                >
                  {step.step}
                </span>

                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/25 transition group-hover:scale-110">
                  <StepIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>

                <h3 className="relative mt-5 text-lg font-bold tracking-tight text-slate-900">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </motion.li>
            )
          })}
        </ol>
      </section>
    </Reveal>
  )
}

export default HowItWorks