function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-lg font-medium text-slate-700">Start Learning</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Paste your notes or enter a topic above to generate flashcards and an
        interactive quiz.
      </p>
    </div>
  )
}

export default EmptyState
