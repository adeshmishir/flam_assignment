const OPTION_LABELS = ['A', 'B', 'C', 'D']

function QuizOptions({ options, selected, onSelect, disabled, submitted, correctAnswer }) {
  if (!Array.isArray(options)) {
    return null
  }

  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label="Options">
      {options.map((option, index) => {
        const isSelected = selected === index
        const isCorrect = submitted && index === correctAnswer
        const isWrongSelection = submitted && isSelected && !isCorrect

        let ring = ''
        let badge = ''
        let label = OPTION_LABELS[index] ?? index + 1

        if (submitted) {
          if (isCorrect) {
            ring = 'border-green-500 bg-green-50 text-green-900'
            badge = 'border-green-600 bg-green-600 text-white'
            label = '✓'
          } else if (isWrongSelection) {
            ring = 'border-red-500 bg-red-50 text-red-900'
            badge = 'border-red-600 bg-red-600 text-white'
            label = '✗'
          } else {
            ring = 'border-slate-200 bg-white text-slate-400'
            badge = 'border-slate-300 bg-white text-slate-400'
          }
        } else if (isSelected) {
          ring = 'border-indigo-500 bg-indigo-50 text-indigo-900'
          badge = 'border-indigo-500 bg-indigo-500 text-white'
        } else {
          ring = 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
          badge = 'border-slate-300 text-slate-500'
        }

        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(index)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed ${ring}`}
          >
            <span
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border text-xs font-semibold ${badge}`}
              aria-hidden="true"
            >
              {label}
            </span>
            <span>{option}</span>
          </button>
        )
      })}
    </div>
  )
}

export default QuizOptions
