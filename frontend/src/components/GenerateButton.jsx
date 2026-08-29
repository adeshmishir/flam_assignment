import { Loader2 } from 'lucide-react'

function GenerateButton({ onClick, disabled, isLoading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-paper transition hover:bg-amber-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none disabled:hover:bg-stone-200 disabled:hover:text-stone-500 disabled:active:scale-100 disabled:focus-visible:ring-0 dark:focus-visible:ring-offset-paper-dark dark:disabled:bg-stone-800 dark:disabled:text-stone-600 dark:disabled:hover:bg-stone-800"
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