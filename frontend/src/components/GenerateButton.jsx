import { Loader2 } from 'lucide-react'

function GenerateButton({ onClick, disabled, isLoading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-blue-500 hover:shadow-md hover:shadow-indigo-600/30 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-500 disabled:shadow-none disabled:hover:from-slate-200 disabled:hover:to-slate-200 disabled:active:scale-100 disabled:focus-visible:ring-0 dark:focus-visible:ring-offset-slate-950 dark:disabled:from-slate-800 dark:disabled:to-slate-800 dark:disabled:text-slate-600"
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