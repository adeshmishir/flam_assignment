import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

function FlashcardControls({ onPrevious, onNext, onFlip, hasPrevious, hasNext }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40'
  const secondary =
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:disabled:hover:bg-slate-900'
  const primary = 'bg-indigo-600 text-white hover:bg-indigo-500'

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`${base} ${secondary}`}
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span>Previous</span>
      </button>
      <button type="button" onClick={onFlip} className={`${base} ${primary}`}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        <span>Flip</span>
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className={`${base} ${secondary}`}
        aria-label="Next"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export default FlashcardControls