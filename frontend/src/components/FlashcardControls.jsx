function FlashcardControls({ onPrevious, onNext, onFlip, hasPrevious, hasNext }) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50'
  const secondary = 'border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50'
  const primary = 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button type="button" onClick={onPrevious} disabled={!hasPrevious} className={`${base} ${secondary} disabled:hover:bg-white`}>
        Previous
      </button>
      <button type="button" onClick={onFlip} className={`${base} ${primary}`}>
        Flip
      </button>
      <button type="button" onClick={onNext} disabled={!hasNext} className={`${base} ${secondary} disabled:hover:bg-white`}>
        Next
      </button>
    </div>
  )
}

export default FlashcardControls
