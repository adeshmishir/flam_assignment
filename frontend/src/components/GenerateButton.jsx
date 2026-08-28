function GenerateButton({ onClick, disabled, isLoading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {isLoading ? 'Generating...' : 'Generate Study Material'}
    </button>
  )
}

export default GenerateButton
