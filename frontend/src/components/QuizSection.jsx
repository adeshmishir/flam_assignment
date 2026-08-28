import { useState } from 'react'
import QuizQuestion from './QuizQuestion.jsx'
import QuizResult from './QuizResult.jsx'

function QuizSection({ quiz }) {
  const questions = Array.isArray(quiz) ? quiz : []
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [isFinished, setIsFinished] = useState(false)

  if (questions.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-slate-600">No quiz questions to show.</p>
      </section>
    )
  }

  const question = questions[currentQuestion]

  const handleSelect = (index) => {
    if (isSubmitted) {
      return
    }
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      return
    }

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

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      setIsFinished(true)
      return
    }

    setCurrentQuestion((prev) => prev + 1)
    setSelectedAnswer(null)
    setIsSubmitted(false)
  }

  if (isFinished) {
    return (
      <section aria-label="Quiz" className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-slate-900">Quiz</h3>
        <QuizResult score={score} total={questions.length} />
      </section>
    )
  }

  return (
    <section aria-label="Quiz" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">Quiz</h3>
        <p className="text-sm text-slate-500">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <QuizQuestion
          question={question}
          selected={selectedAnswer}
          onSelect={handleSelect}
          isSubmitted={isSubmitted}
          onNext={handleNext}
          isLast={currentQuestion === questions.length - 1}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Score: {score} / {questions.length}</p>
        {!isSubmitted && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Submit Answer
          </button>
        )}
      </div>
    </section>
  )
}

export default QuizSection
