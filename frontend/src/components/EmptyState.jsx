import { BookOpen } from 'lucide-react'

function EmptyState() {
  return (
    <section
      aria-label="Empty state"
      className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/25 to-blue-500/15 dark:from-indigo-500/30 dark:to-blue-500/20"
        />
        <span aria-hidden="true" className="absolute inset-[2px] rounded-[14px] bg-white dark:bg-slate-900" />
        <BookOpen
          className="relative h-6 w-6 animate-drift text-indigo-500 dark:text-indigo-400"
          aria-hidden="true"
        />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
        Start Learning
      </h2>
    </section>
  )
}

export default EmptyState