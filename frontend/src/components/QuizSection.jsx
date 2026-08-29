import { useState } from 'react'
import { motion } from 'framer-motion'
import QuizQuestion from './QuizQuestion.jsx'
import QuizResult from './QuizResult.jsx'

function QuizSection({ quiz }) {
  const questions = Array.isArray(quiz) ? quiz : []
  const [questionStates, setQuestionStates] = useState(() =>
    questions.map(() => ({ selected: null, submitted: false }))
  )

  if (questions.length === 0) {
    return (
      <section
        aria-label="Quiz"
        className="rounded-2xl border border-stone-200/70 bg-paper/70 px-6 py-10 text-center shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70"
      >
        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">No quiz questions to show.</p>
      </section>
    )
  }

  const updateQuestion = (index, patch) => {
    setQuestionStates((prev) => prev.map((state, i) => (i === index ? { ...state, ...patch } : state)))
  }

  const handleSelect = (index, optionIndex) => {
    const state = questionStates[index]
    if (state.submitted) {
      return
    }
    updateQuestion(index, { selected: optionIndex })
  }

  const handleSubmit = (index) => {
    const state = questionStates[index]
    if (state.submitted || state.selected === null) {
      return
    }
    updateQuestion(index, { submitted: true })
  }

  const score = questions.reduce(
    (acc, question, index) =>
      acc + (questionStates[index].submitted && questionStates[index].selected === question.answer ? 1 : 0),
    0
  )
  const allAnswered = questionStates.every((state) => state.submitted)

  const retryWrong = () => {
    setQuestionStates((prev) =>
      prev.map((state, index) =>
        state.submitted && state.selected === questions[index].answer
          ? state
          : { selected: null, submitted: false }
      )
    )
  }

  return (
    <section aria-label="Quiz" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-stone-900 dark:text-white">Quiz</h3>
        <span
          className={`flex-none rounded-full border px-2.5 py-1 text-xs font-semibold ${
            allAnswered
              ? 'border-emerald-200/80 bg-emerald-50/50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'border-stone-200/80 bg-white/60 text-stone-600 dark:border-stone-700 dark:bg-paper-soft-dark/70 dark:text-stone-300'
          }`}
        >
          Score: {score} / {questions.length}
        </span>
      </div>

      <ol className="flex flex-col gap-4">
        {questions.map((question, index) => {
          const state = questionStates[index]
          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: index * 0.03 }}
              className="rounded-2xl border border-stone-200/70 bg-paper/70 px-5 py-6 shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70 sm:px-7 sm:py-7"
            >
              <QuizQuestion
                question={question}
                selected={state.selected}
                onSelect={(optionIndex) => handleSelect(index, optionIndex)}
                isSubmitted={state.submitted}
                onSubmit={() => handleSubmit(index)}
              />
            </motion.li>
          )
        })}
      </ol>

      {allAnswered && (
        <QuizResult
          score={score}
          total={questions.length}
          onRetry={retryWrong}
          retry={false}
        />
      )}
    </section>
  )
}

export default QuizSection