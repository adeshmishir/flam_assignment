function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm" aria-live="polite">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
        aria-hidden="true"
      />
      <div>
        <p className="text-lg font-medium text-slate-800">
          Generating your study material...
        </p>
        <p className="mt-1 text-sm text-slate-500">This may take a few seconds.</p>
      </div>
    </div>
  )
}

export default LoadingState
