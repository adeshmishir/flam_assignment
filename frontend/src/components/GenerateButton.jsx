import { Loader2 } from 'lucide-react'

function GenerateButton({ onClick, disabled, isLoading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:hover:bg-slate-200 disabled:active:scale-100 disabled:focus-visible:ring-0 dark:focus-visible:ring-offset-slate-950 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 dark:disabled:hover:bg-slate-800 sm:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Generating...
        </>
      ) : (
        'Generate Study Material'
      )}
    </button>
  )
}

export default GenerateButton