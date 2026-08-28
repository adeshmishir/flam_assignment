function Flashcard({ card, isFlipped, onFlip }) {
  if (!card) {
    return null
  }

  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={onFlip}
        className="w-full cursor-pointer py-8 focus:outline-none"
        aria-label="Flip card"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {isFlipped ? 'Answer' : 'Question'}
        </span>
        <p className="mt-5 text-lg leading-relaxed text-slate-800">
          {isFlipped ? card.answer : card.question}
        </p>
      </button>
      <button
        type="button"
        onClick={onFlip}
        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Flip
      </button>
    </div>
  )
}

export default Flashcard
