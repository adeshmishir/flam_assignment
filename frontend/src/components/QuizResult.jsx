function QuizResult({ score, total }) {
  const incorrect = total - score

  let message = 'Keep practicing!'
  if (total > 0 && score === total) {
    message = 'Perfect score. Great job!'
  } else if (total > 0 && score / total >= 0.5) {
    message = 'Nice work. Keep it up!'
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Quiz Complete!</h3>
      <p className="text-sm uppercase tracking-wide text-slate-500">You scored</p>
      <p className="text-4xl font-bold text-indigo-600">
        {score} / {total}
      </p>
      <div className="text-sm text-slate-600">
        <p>Correct: {score}</p>
        <p>Incorrect: {incorrect}</p>
      </div>
      <p className="mt-2 text-slate-700">{message}</p>
    </div>
  )
}

export default QuizResult
