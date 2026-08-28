function QuizResult({ score, total, retry, originalScore, originalTotal, onRetry }) {
  const incorrect = total - score
  const perfect = total > 0 && score === total

  if (retry) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">Retry Complete!</h3>
        <p className="text-sm uppercase tracking-wide text-slate-500">You scored</p>
        <p className="text-4xl font-bold text-indigo-600">
          {score} / {total}
        </p>
        <div className="text-sm text-slate-600">
          <p>Correct: {score}</p>
          <p>Incorrect: {incorrect}</p>
        </div>
        {typeof originalScore === 'number' && (
          <p className="mt-2 text-sm text-slate-500">
            Original Score: {originalScore} / {originalTotal}
          </p>
        )}
        <p className="mt-2 text-slate-700">
          {perfect ? 'Great job!' : 'Keep practicing!'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">
        {perfect ? 'Perfect Score!' : 'Quiz Complete!'}
      </h3>
      <p className="text-sm uppercase tracking-wide text-slate-500">You scored</p>
      <p className="text-4xl font-bold text-indigo-600">
        {score} / {total}
      </p>
      <div className="text-sm text-slate-600">
        <p>Correct: {score}</p>
        <p>Incorrect: {incorrect}</p>
      </div>
      {perfect ? (
        <p className="mt-2 text-slate-700">You got every question correct. Great job!</p>
      ) : (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Retry Wrong Answers
        </button>
      )}
    </div>
  )
}

export default QuizResult
