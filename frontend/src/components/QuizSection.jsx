import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import QuizQuestion from './QuizQuestion.jsx'
import QuizResult from './QuizResult.jsx'

const primaryButton =
  'inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:hover:bg-slate-200 dark:focus-visible:ring-offset-slate-950 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 dark:disabled:hover:bg-slate-800'

function QuizSection({ quiz }) {
  const questions = Array.isArray(quiz) ? quiz : []
  const [quizMode, setQuizMode] = useState('main')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])

  const [retryQuestions, setRetryQuestions] = useState([])
  const [retryIndex, setRetryIndex] = useState(0)
  const [retrySelected, setRetrySelected] = useState(null)
  const [retrySubmitted, setRetrySubmitted] = useState(false)
  const [retryScore, setRetryScore] = useState(0)

  if (questions.length === 0) {
    return (
      <section
        aria-label="Quiz"
        className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No quiz questions to show.</p>
      </section>
    )
  }

  const startRetry = () => {
    const indexes = userAnswers
      .filter((answer) => !answer.correct)
      .map((answer) => answer.questionIndex)
    setRetryQuestions(questions.filter((_, index) => indexes.includes(index)))
    setRetryIndex(0)
    setRetrySelected(null)
    setRetrySubmitted(false)
    setRetryScore(0)
    setQuizMode('retry')
  }

  const renderQuestionFlow = ({
    title,
    questionList,
    index,
    selected,
    submitted,
    scoreValue,
    onSelect,
    onSubmit,
    onNext,
  }) => {
    const question = questionList[index]
    const isLast = index === questionList.length - 1
    const progress = ((index + 1) / questionList.length) * 100

    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <span className="flex-none rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Question {index + 1} of {questionList.length}
          </span>
        </div>

        <div
          className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={questionList.length}
          aria-valuenow={index + 1}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full bg-indigo-500"
          />
        </div>

        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-7 sm:py-7"
        >
          <QuizQuestion
            question={question}
            selected={selected}
            onSelect={onSelect}
            isSubmitted={submitted}
            onNext={onNext}
            isLast={isLast}
          />
        </motion.div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Score: {scoreValue} / {questionList.length}
          </p>
          {!submitted && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={selected === null}
              className={primaryButton}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Submit Answer
            </button>
          )}
        </div>
      </>
    )
  }

  if (quizMode === 'main') {
    const question = questions[currentQuestion]

    const handleMainSelect = (index) => {
      if (!isSubmitted) {
        setSelectedAnswer(index)
      }
    }

    const handleMainSubmit = () => {
      const correct = selectedAnswer === question.answer
      setUserAnswers((prev) => [
        ...prev,
        { questionIndex: currentQuestion, selectedAnswer, correct },
      ])
      if (correct) {
        setScore((prev) => prev + 1)
      }
      setIsSubmitted(true)
    }

    const handleMainNext = () => {
      if (currentQuestion === questions.length - 1) {
        setQuizMode('result')
        return
      }
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsSubmitted(false)
    }

    return (
      <section aria-label="Quiz" className="flex flex-col gap-4">
        {renderQuestionFlow({
          title: 'Quiz',
          questionList: questions,
          index: currentQuestion,
          selected: selectedAnswer,
          submitted: isSubmitted,
          scoreValue: score,
          onSelect: handleMainSelect,
          onSubmit: handleMainSubmit,
          onNext: handleMainNext,
        })}
      </section>
    )
  }

  if (quizMode === 'result') {
    const total = questions.length
    const perfect = score === total
    return (
      <section aria-label="Quiz" className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Quiz</h3>
        <QuizResult
          score={score}
          total={total}
          onRetry={startRetry}
          retry={false}
        />
        {perfect && (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Nothing to retry since you got every question correct.
          </p>
        )}
      </section>
    )
  }

  if (quizMode === 'retry') {
    const question = retryQuestions[retryIndex]

    const handleRetrySubmit = () => {
      const correct = retrySelected === question.answer
      if (correct) {
        setRetryScore((prev) => prev + 1)
      }
      setRetrySubmitted(true)
    }

    const handleRetrySelect = (index) => {
      if (!retrySubmitted) {
        setRetrySelected(index)
      }
    }

    const handleRetryNext = () => {
      if (retryIndex === retryQuestions.length - 1) {
        setQuizMode('retryResult')
        return
      }
      setRetryIndex((prev) => prev + 1)
      setRetrySelected(null)
      setRetrySubmitted(false)
    }

    return (
      <section aria-label="Quiz" className="flex flex-col gap-4">
        {renderQuestionFlow({
          title: 'Retry Wrong Answers',
          questionList: retryQuestions,
          index: retryIndex,
          selected: retrySelected,
          submitted: retrySubmitted,
          scoreValue: retryScore,
          onSelect: handleRetrySelect,
          onSubmit: handleRetrySubmit,
          onNext: handleRetryNext,
        })}
      </section>
    )
  }

  return (
    <section aria-label="Quiz" className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">Quiz</h3>
      <QuizResult
        score={retryScore}
        total={retryQuestions.length}
        retry
        originalScore={score}
        originalTotal={questions.length}
      />
    </section>
  )
}

export default QuizSection