import { BookOpen } from 'lucide-react'

function EmptyState() {
  return (
    <section
      aria-label="Empty state"
      className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <BookOpen
        className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600"
        aria-hidden="true"
      />
      <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
        Start Learning
      </h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Add a topic or paste your notes above to get started.
      </p>
    </section>
  )
}

export default EmptyState