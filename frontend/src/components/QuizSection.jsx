import { useState } from 'react'
import QuizQuestion from './QuizQuestion.jsx'
import QuizResult from './QuizResult.jsx'

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
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-slate-600">No quiz questions to show.</p>
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

    return (
      <>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">
            Question {index + 1} of {questionList.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <QuizQuestion
            question={question}
            selected={selected}
            onSelect={onSelect}
            isSubmitted={submitted}
            onNext={onNext}
            isLast={isLast}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Score: {scoreValue} / {questionList.length}
          </p>
          {!submitted && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={selected === null}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
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
        <h3 className="text-xl font-semibold text-slate-900">Quiz</h3>
        <QuizResult
          score={score}
          total={total}
          onRetry={startRetry}
          retry={false}
        />
        {perfect && (
          <p className="text-center text-sm text-slate-500">
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
      <h3 className="text-xl font-semibold text-slate-900">Quiz</h3>
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
