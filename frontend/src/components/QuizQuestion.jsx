import QuizOptions from './QuizOptions.jsx'

function QuizQuestion({ question, selected, onSelect, isSubmitted, onNext, isLast }) {
  if (!question) {
    return null
  }

  const isCorrect = selected === question.answer

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-medium text-slate-800">{question.question}</p>

      <QuizOptions
        options={question.options}
        selected={selected}
        onSelect={onSelect}
        disabled={isSubmitted}
      />

      {isSubmitted && (
        <div
          className={`rounded-lg border p-4 ${
            isCorrect
              ? 'border-green-300 bg-green-50'
              : 'border-red-300 bg-red-50'
          }`}
          role="status"
        >
          <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect.'}
          </p>
          {!isCorrect && (
            <p className="mt-1 text-sm text-slate-700">
              Correct answer: {question.options[question.answer]}
            </p>
          )}
          <p className="mt-1 text-sm text-slate-700">Explanation: {question.explanation}</p>
        </div>
      )}

      {isSubmitted && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLast ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizQuestion
