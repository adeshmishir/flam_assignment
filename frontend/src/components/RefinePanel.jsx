import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Loader2, Send, Wand2 } from 'lucide-react'

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
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/80 via-white/60 to-violet-50/70 p-5 shadow-md shadow-indigo-900/5 backdrop-blur dark:border-indigo-500/25 dark:from-indigo-500/10 dark:via-slate-900/60 dark:to-violet-500/10 sm:p-7"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/25">
          <Wand2 className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Refine this material
          </h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Ask the AI to adjust what it generated — reword flashcards, add a
            checklist, or expand the quiz.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <textarea
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRefining}
          rows={2}
          placeholder="e.g. Add a checklist for common mistakes and make the quiz harder"
          aria-label="Refinement instruction"
          className="block w-full resize-y rounded-xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
        />

        {error && (
          <p
            role="alert"
            className="flex items-center gap-2 text-sm font-medium text-rose-600 dark:text-rose-400"
          >
            <AlertTriangle className="h-4 w-4 flex-none" aria-hidden="true" />
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-none disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
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
    </motion.div>
  )
}

export default RefinePanel