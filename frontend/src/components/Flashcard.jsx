function Flashcard({ card, isFlipped, onFlip }) {
  if (!card) {
    return null
  }

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <button
        type="button"
        onClick={onFlip}
        className="w-full focus:outline-none"
        aria-label="Flip card"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {isFlipped ? 'Answer' : 'Question'}
        </p>
        <p className="mt-4 text-lg text-slate-800">
          {isFlipped ? card.answer : card.question}
        </p>
      </button>
      <button
        type="button"
        onClick={onFlip}
        className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Flip
      </button>
    </div>
  )
}

export default Flashcard
