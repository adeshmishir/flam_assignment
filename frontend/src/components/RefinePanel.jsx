import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'

function RefinePanel({ onRefine, isRefining, error }) {
  const [instruction, setInstruction] = useState('')

  const canSubmit = instruction.trim().length > 0 && !isRefining

  const handleSubmit = () => {
    const trimmed = instruction.trim()
    if (!trimmed || isRefining) {
      return
    }
    onRefine(trimmed)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-6 sm:py-6">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        Refine this material
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Ask to adjust what was generated — reword flashcards, add a checklist, or
        expand the quiz.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <textarea
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRefining}
          rows={2}
          placeholder="e.g. Add a checklist for common mistakes and make the quiz harder"
          aria-label="Refinement instruction"
          className="block w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:disabled:bg-slate-800/60 dark:disabled:text-slate-600"
        />

        {error && (
          <p
            role="alert"
            className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:hover:bg-slate-200 dark:focus-visible:ring-offset-slate-950 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 dark:disabled:hover:bg-slate-800"
          >
            {isRefining ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Refining...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Apply changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RefinePanel