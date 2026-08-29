function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-white/60 py-6 dark:border-slate-800 dark:bg-slate-950/40">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-1.5 px-4 text-xs text-slate-400 dark:text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />
          StudyMate — AI Study Assistant
        </p>
        <p>Flashcards · Quiz · Study blocks</p>
      </div>
    </footer>
  )
}

export default Footer