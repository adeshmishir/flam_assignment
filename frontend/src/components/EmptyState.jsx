function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-lg font-medium text-slate-700">No study material yet</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Enter a topic or paste your notes above, then click Generate Study
        Material to create flashcards and a quiz.
      </p>
    </div>
  )
}

export default EmptyState
