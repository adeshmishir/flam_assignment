import { motion } from 'framer-motion'
import { CircleCheck, CircleX, Send } from 'lucide-react'
import QuizOptions from './QuizOptions.jsx'

function QuizQuestion({ question, selected, onSelect, isSubmitted, onSubmit }) {
  if (!question) {
    return null
  }

  const isCorrect = selected === question.answer

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base leading-relaxed font-medium text-stone-900 dark:text-stone-100 sm:text-lg">
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

      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={`rounded-xl border p-4 ${
            isCorrect
              ? 'border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10'
              : 'border-rose-200/80 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-500/10'
          }`}
          role="status"
        >
          <p
            className={`flex items-center gap-2 font-semibold ${
              isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
            }`}
          >
            {isCorrect ? (
              <CircleCheck className="h-5 w-5" aria-hidden="true" />
            ) : (
              <CircleX className="h-5 w-5" aria-hidden="true" />
            )}
            <span>{isCorrect ? 'Correct!' : 'Incorrect.'}</span>
          </p>
          {!isCorrect && (
            <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              Correct answer: {question.options[question.answer]}
            </p>
          )}
          <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            Explanation: {question.explanation}
          </p>
        </motion.div>
      )}

      {!isSubmitted && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={selected === null}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-paper transition hover:bg-amber-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none disabled:hover:bg-stone-200 disabled:hover:text-stone-500 dark:focus-visible:ring-offset-paper-dark dark:disabled:bg-stone-800 dark:disabled:text-stone-600 dark:disabled:hover:bg-stone-800"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit Answer
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizQuestion