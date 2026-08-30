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
    <div className="rounded-2xl border border-stone-200/70 bg-paper/70 px-4 py-4 shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70 sm:px-5 sm:py-5">
      <h3 className="text-sm font-semibold text-stone-900 dark:text-white">
        Refine this material
      </h3>
      <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
        Fine-tune what was generated.
      </p>

      <div className="mt-3 flex flex-col gap-2.5">
        <textarea
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRefining}
          rows={2}
          placeholder="e.g. Add a checklist for common mistakes and make the quiz harder"
          aria-label="Refinement instruction"
          className="block w-full resize-y rounded-lg border border-stone-300/90 bg-white/80 px-3 py-1.5 text-sm text-stone-900 shadow-[inset_0_1px_2px_rgb(120_104_80/0.05)] transition placeholder:text-stone-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 disabled:cursor-not-allowed disabled:bg-stone-100/60 disabled:text-stone-400 dark:border-stone-700 dark:bg-paper-dark/80 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/25 dark:disabled:bg-paper-dark/40 dark:disabled:text-stone-600"
        />

        {error && (
          <p
            role="alert"
            className="flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-400"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-paper transition hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none disabled:hover:bg-stone-200 disabled:hover:text-stone-500 dark:focus-visible:ring-offset-paper-dark dark:disabled:bg-stone-800 dark:disabled:text-stone-600 dark:disabled:hover:bg-stone-800"
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