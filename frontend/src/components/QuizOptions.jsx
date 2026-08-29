import { motion } from 'framer-motion'
import { CircleCheck, CircleX } from 'lucide-react'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function QuizOptions({ options, selected, onSelect, disabled, submitted, correctAnswer }) {
  if (!Array.isArray(options)) {
    return null
  }

  const handleKeyDown = (event) => {
    if (disabled) {
      return
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const next = selected === null ? 0 : (selected - 1 + options.length) % options.length
      onSelect(next)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      const next = selected === null ? 0 : (selected + 1) % options.length
      onSelect(next)
    } else if (/^[1-9]$/.test(event.key)) {
      const index = Number(event.key) - 1
      if (index < options.length) {
        onSelect(index)
      }
    }
  }

  return (
    <div
      className="flex flex-col gap-3"
      role="radiogroup"
      aria-label="Options"
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
    >
      {options.map((option, index) => {
        const isSelected = selected === index
        const isCorrect = submitted && index === correctAnswer
        const isWrongSelection = submitted && isSelected && !isCorrect

        let ring = ''
        let badge = ''
        let label = OPTION_LABELS[index] ?? index + 1
        let dimmed = false

        if (submitted) {
          if (isCorrect) {
            ring = 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400/40 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:ring-emerald-500/30'
            badge = 'bg-emerald-500 text-white'
            label = <CircleCheck className="h-4 w-4" aria-hidden="true" />
          } else if (isWrongSelection) {
            ring = 'border-rose-400 bg-rose-50 ring-1 ring-rose-400/40 dark:border-rose-500/60 dark:bg-rose-500/10 dark:ring-rose-500/30'
            badge = 'bg-rose-500 text-white'
            label = <CircleX className="h-4 w-4" aria-hidden="true" />
          } else {
            ring = 'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-500'
            badge = 'border border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500'
            dimmed = true
          }
        } else if (isSelected) {
          ring = 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500/40 dark:border-indigo-400 dark:bg-indigo-500/10 dark:ring-indigo-500/30'
          badge = 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
        } else {
          ring =
            'border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-900/5 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-indigo-500/60'
          badge = 'border border-slate-300 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
        }

        return (
          <motion.button
            key={index}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(index)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.25, ease: 'easeOut' }}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed sm:text-[15px] ${ring}`}
          >
            <span
              className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${
                submitted && (isCorrect || isWrongSelection) ? '' : 'border'
              } ${badge}`}
              aria-hidden="true"
            >
              {label}
            </span>
            <span className={`flex-1 leading-snug ${dimmed ? 'text-slate-400' : ''}`}>
              {option}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default QuizOptions