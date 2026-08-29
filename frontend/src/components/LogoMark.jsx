import { BrainCircuit } from 'lucide-react'

function LogoMark() {
  return (
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-white text-indigo-600 dark:bg-slate-900 dark:text-indigo-400">
      <BrainCircuit className="h-6 w-6" aria-hidden="true" strokeWidth={2.2} />
    </span>
  )
}

export default LogoMark