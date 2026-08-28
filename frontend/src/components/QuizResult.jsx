function QuizResult({ score, total, retry, originalScore, originalTotal, onRetry }) {
  const incorrect = total - score
  const perfect = total > 0 && score === total

  if (retry) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">Retry Complete!</h3>
        <p className="text-sm uppercase tracking-wide text-slate-500">You scored</p>
        <p className="text-4xl font-bold text-indigo-600">
          {score} <span className="text-2xl font-medium text-slate-400">/ {total}</span>
        </p>
        <div className="mt-1 flex gap-6 text-sm text-slate-600">
          <p>Correct: <span className="font-semibold text-slate-800">{score}</span></p>
          <p>Incorrect: <span className="font-semibold text-slate-800">{incorrect}</span></p>
        </div>
        {typeof originalScore === 'number' && (
          <p className="text-sm text-slate-500">
            Original Score: {originalScore} / {originalTotal}
          </p>
        )}
        <p className="mt-1 text-slate-700">{perfect ? 'Great job!' : 'Keep practicing!'}</p>
      </div>
    )
  }

  const headline = perfect ? 'Perfect Score!' : 'Quiz Complete!'
  const message = perfect
    ? 'You got every question correct. Great job!'
    : 'Review your wrong answers to keep improving.'

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{headline}</h3>
      <p className="text-sm uppercase tracking-wide text-slate-500">You scored</p>
      <p className="text-4xl font-bold text-indigo-600">
        {score} <span className="text-2xl font-medium text-slate-400">/ {total}</span>
      </p>
      <div className="mt-1 flex gap-6 text-sm text-slate-600">
        <p>Correct: <span className="font-semibold text-slate-800">{score}</span></p>
        <p>Incorrect: <span className="font-semibold text-slate-800">{incorrect}</span></p>
      </div>
      {!perfect && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Retry Wrong Answers
        </button>
      )}
      {perfect && <p className="mt-1 text-slate-700">{message}</p>}
    </div>
  )
}

export default QuizResult
