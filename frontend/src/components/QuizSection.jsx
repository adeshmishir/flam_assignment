import { useState } from 'react'
import { motion } from 'framer-motion'
import { Undo2 } from 'lucide-react'
import QuizQuestion from './QuizQuestion.jsx'
import QuizResult from './QuizResult.jsx'

function QuizSection({ quiz }) {
  const questions = Array.isArray(quiz) ? quiz : []
  const [questionStates, setQuestionStates] = useState(() =>
    questions.map(() => ({ selected: null, submitted: false }))
  )
  const [retryMode, setRetryMode] = useState(false)
  const [retryQuestions, setRetryQuestions] = useState([])
  const [retryStates, setRetryStates] = useState([])
  const [originalScore, setOriginalScore] = useState(null)

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

  const handleRetry = (index) => {
    updateQuestion(index, { selected: null, submitted: false })
  }

  const score = questions.reduce(
    (acc, question, index) =>
      acc + (questionStates[index].submitted && questionStates[index].selected === question.answer ? 1 : 0),
    0
  )
  const allAnswered = questionStates.every((state) => state.submitted)

  const handleRetryWrong = () => {
    const wrong = questions
      .map((question, index) => ({ question, index }))
      .filter(({ index }) => questionStates[index].submitted && questionStates[index].selected !== questions[index].answer)

    if (wrong.length === 0) {
      return
    }

    setRetryQuestions(wrong.map(({ question }) => question))
    setRetryStates(wrong.map(() => ({ selected: null, submitted: false })))
    setOriginalScore(score)
    setRetryMode(true)
  }

  const updateRetryState = (index, patch) => {
    setRetryStates((prev) => prev.map((state, i) => (i === index ? { ...state, ...patch } : state)))
  }

  const handleRetrySelect = (index, optionIndex) => {
    if (retryStates[index].submitted) {
      return
    }
    updateRetryState(index, { selected: optionIndex })
  }

  const handleRetrySubmit = (index) => {
    const state = retryStates[index]
    if (state.submitted || state.selected === null) {
      return
    }
    updateRetryState(index, { submitted: true })
  }

  const handleRetryReset = (index) => {
    updateRetryState(index, { selected: null, submitted: false })
  }

  const retryScore = retryStates.reduce(
    (acc, state, index) =>
      acc + (state.submitted && state.selected === retryQuestions[index].answer ? 1 : 0),
    0
  )
  const allRetried = retryStates.length > 0 && retryStates.every((state) => state.submitted)

  const backToAll = () => {
    setRetryMode(false)
    setRetryQuestions([])
    setRetryStates([])
    setOriginalScore(null)
  }

  const scoreChip = (count, total, answered) => (
    <span
      className={`flex-none rounded-full border px-2.5 py-1 text-xs font-semibold ${
        answered
          ? 'border-emerald-200/80 bg-emerald-50/50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
          : 'border-stone-200/80 bg-white/60 text-stone-600 dark:border-stone-700 dark:bg-paper-soft-dark/70 dark:text-stone-300'
      }`}
    >
      Score: {count} / {total}
    </span>
  )

  if (retryMode) {
    return (
      <section aria-label="Quiz" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-stone-900 dark:text-white">
            Retry wrong answers
          </h3>
          {scoreChip(retryScore, retryQuestions.length, allRetried)}
        </div>

        <ol className="flex flex-col gap-3">
          {retryQuestions.map((question, index) => {
            const state = retryStates[index]
            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut', delay: index * 0.03 }}
                className="rounded-2xl border border-stone-200/70 bg-paper/70 px-4 py-4 shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70 sm:px-5 sm:py-5"
              >
                <QuizQuestion
                  question={question}
                  selected={state.selected}
                  onSelect={(optionIndex) => handleRetrySelect(index, optionIndex)}
                  isSubmitted={state.submitted}
                  onSubmit={() => handleRetrySubmit(index)}
                  onRetry={() => handleRetryReset(index)}
                />
              </motion.li>
            )
          })}
        </ol>

        {allRetried && (
          <div className="flex flex-col gap-3">
            <QuizResult
              score={retryScore}
              total={retryQuestions.length}
              retry
              originalScore={originalScore}
              originalTotal={questions.length}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={backToAll}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200/90 bg-white/70 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-500/60 hover:bg-white hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 dark:border-stone-700 dark:bg-paper-dark/70 dark:text-stone-200 dark:hover:border-amber-500/40 dark:hover:bg-paper-soft-dark dark:hover:text-amber-500"
              >
                <Undo2 className="h-4 w-4" aria-hidden="true" />
                Back to all questions
              </button>
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section aria-label="Quiz" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-stone-900 dark:text-white">Quiz</h3>
        {scoreChip(score, questions.length, allAnswered)}
      </div>

      <ol className="flex flex-col gap-3">
        {questions.map((question, index) => {
          const state = questionStates[index]
          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut', delay: index * 0.03 }}
              className="rounded-2xl border border-stone-200/70 bg-paper/70 px-4 py-4 shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70 sm:px-5 sm:py-5"
            >
              <QuizQuestion
                question={question}
                selected={state.selected}
                onSelect={(optionIndex) => handleSelect(index, optionIndex)}
                isSubmitted={state.submitted}
                onSubmit={() => handleSubmit(index)}
                onRetry={() => handleRetry(index)}
              />
            </motion.li>
          )
        })}
      </ol>

      {allAnswered && (
        <QuizResult
          score={score}
          total={questions.length}
          onRetry={handleRetryWrong}
          retry={false}
        />
      )}
    </section>
  )
}

export default QuizSection