function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600"
        aria-hidden="true"
      >
        📝
      </span>
      <p className="text-lg font-medium text-slate-700">Start Learning</p>
      <p className="mx-auto max-w-md text-sm text-slate-500">
        Paste your notes or enter a topic above to generate flashcards and an
        interactive quiz.
      </p>
    </div>
  )
}

export default EmptyState
