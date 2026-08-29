import { BrainCircuit } from 'lucide-react'

function LogoMark() {
  return (
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white/70 text-amber-700 ring-1 ring-stone-200/60 dark:bg-paper-soft-dark dark:text-amber-500 dark:ring-stone-700/50">
      <BrainCircuit className="h-6 w-6" aria-hidden="true" strokeWidth={2.2} />
    </span>
  )
}

export default LogoMark