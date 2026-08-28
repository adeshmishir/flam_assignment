function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center" role="alert">
      <p className="text-lg font-semibold text-red-700">Something went wrong</p>
      <p className="max-w-md text-sm text-red-600">
        {message || 'Unable to generate your study material. Please try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  )
}

export default ErrorState
