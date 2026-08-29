import { GraduationCap, Heart } from 'lucide-react'

function Footer() {
  return (
    <footer className="relative border-t border-slate-200/80 bg-white/50 py-8 dark:border-slate-800/80 dark:bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          StudyMate — AI Study Assistant
        </p>
        <p className="inline-flex items-center gap-1.5">
          Built with
          <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" aria-hidden="true" />
          for faster learning
        </p>
      </div>
    </footer>
  )
}

export default Footer