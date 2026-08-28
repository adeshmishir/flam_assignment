const OPTION_LABELS = ['A', 'B', 'C', 'D']

function QuizOptions({ options, selected, onSelect, disabled }) {
  if (!Array.isArray(options)) {
    return null
  }

  return (
    <div className="flex flex-col gap-3" role="radiogroup" aria-label="Options">
      {options.map((option, index) => {
        const isSelected = selected === index
        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(index)}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 ${
              isSelected
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border text-xs font-semibold ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-slate-300 text-slate-500'
              }`}
            >
              {OPTION_LABELS[index] ?? index + 1}
            </span>
            <span>{option}</span>
          </button>
        )
      })}
    </div>
  )
}

export default QuizOptions
