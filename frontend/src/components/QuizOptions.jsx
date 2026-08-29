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
      className="flex flex-col gap-2.5"
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
        let glow = ''

        if (submitted) {
          if (isCorrect) {
            ring = 'border-emerald-500/60 bg-emerald-50/60 dark:border-emerald-500/60 dark:bg-emerald-500/10'
            badge = 'bg-emerald-600 text-white'
            label = <CircleCheck className="h-4 w-4" aria-hidden="true" />
          } else if (isWrongSelection) {
            ring = 'border-rose-400/70 bg-rose-50/60 dark:border-rose-500/60 dark:bg-rose-500/10'
            badge = 'bg-rose-600 text-white'
            label = <CircleX className="h-4 w-4" aria-hidden="true" />
          } else {
            ring = 'border-stone-200/80 bg-white/60 text-stone-400 dark:border-stone-700/70 dark:bg-paper-dark/50 dark:text-stone-500'
            badge = 'border border-stone-300/80 bg-white/60 text-stone-400 dark:border-stone-600 dark:bg-paper-dark/60 dark:text-stone-500'
            dimmed = true
          }
        } else if (isSelected) {
          ring =
            'border-amber-600/80 bg-amber-50 shadow-paper dark:border-amber-500/70 dark:bg-amber-500/10'
          badge = 'bg-amber-600 text-white'
          glow = 'ring-2 ring-amber-600/20'
        } else {
          ring =
            'border-stone-200/90 bg-white/70 text-stone-800 hover:border-amber-500/60 hover:bg-white hover:shadow-paper dark:border-stone-700 dark:bg-paper-dark/60 dark:text-stone-100 dark:hover:border-amber-500/40 dark:hover:bg-paper-dark'
          badge = 'border border-stone-300/80 bg-stone-100/70 text-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300'
        }

        return (
          <motion.button
            key={index}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(index)}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 disabled:cursor-not-allowed sm:text-[15px] ${ring} ${glow}`}
          >
            <span
              className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${
                submitted && (isCorrect || isWrongSelection) ? '' : 'border'
              } ${badge}`}
              aria-hidden="true"
            >
              {label}
            </span>
            <span className={`flex-1 leading-snug ${dimmed ? 'text-stone-400 dark:text-stone-500' : ''}`}>
              {option}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default QuizOptions