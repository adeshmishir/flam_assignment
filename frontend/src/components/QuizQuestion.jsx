import { motion } from 'framer-motion'
import { CircleCheck, CircleX, ChevronRight } from 'lucide-react'
import QuizOptions from './QuizOptions.jsx'

function QuizQuestion({ question, selected, onSelect, isSubmitted, onNext, isLast }) {
  if (!question) {
    return null
  }

  const isCorrect = selected === question.answer

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-semibold leading-relaxed text-slate-800 sm:text-xl">
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
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`rounded-2xl border p-4 ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50/80'
              : 'border-rose-200 bg-rose-50/80'
          }`}
          role="status"
        >
          <p
            className={`flex items-center gap-2 font-bold ${
              isCorrect ? 'text-emerald-700' : 'text-rose-700'
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
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Correct answer: {question.options[question.answer]}
            </p>
          )}
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            Explanation: {question.explanation}
          </p>
        </motion.div>
      )}

      {isSubmitted && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            {isLast ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizQuestion