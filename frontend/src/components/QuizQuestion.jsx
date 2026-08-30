import { RotateCcw, Send } from 'lucide-react'
import QuizOptions from './QuizOptions.jsx'

function QuizQuestion({ question, selected, onSelect, isSubmitted, onSubmit, onRetry }) {
  if (!question) {
    return null
  }

  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-sm leading-relaxed font-medium text-stone-900 dark:text-stone-100 sm:text-base">
        {question.question}
      </p>

      <QuizOptions
        options={question.options}
        selected={selected}
        onSelect={onSelect}
        disabled={isSubmitted}
        submitted={isSubmitted}
        correctAnswer={question.answer}
      />

      {isSubmitted ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-200/90 bg-white/70 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-500/60 hover:bg-white hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 dark:border-stone-700 dark:bg-paper-dark/70 dark:text-stone-200 dark:hover:border-amber-500/40 dark:hover:bg-paper-soft-dark dark:hover:text-amber-500"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSubmit}
            disabled={selected === null}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-paper transition hover:bg-amber-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none disabled:hover:bg-stone-200 disabled:hover:text-stone-500 dark:focus-visible:ring-offset-paper-dark dark:disabled:bg-stone-800 dark:disabled:text-stone-600 dark:disabled:hover:bg-stone-800"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizQuestion