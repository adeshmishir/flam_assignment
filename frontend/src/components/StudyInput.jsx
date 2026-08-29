import { FileText, Sparkles, X } from 'lucide-react'

const SUGGESTIONS = [
  'Binary Search',
  'DBMS Normalization',
  'Operating Systems',
  'Computer Networks',
  'React Hooks',
]

function StudyInput({ value, onChange, onFillSuggestion, disabled }) {
  const charCount = value.length

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="study-material"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          Your notes or topic
        </label>
        <div className="relative mt-2">
          <textarea
            id="study-material"
            name="study-material"
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={8}
            wrap="soft"
            placeholder="Paste your notes here, or describe a topic — e.g. 'binary search algorithm'"
            className="block w-full resize-y rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 pr-11 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-800 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
            aria-describedby="study-material-hint"
          />
          <FileText
            className="pointer-events-none absolute top-3.5 right-3.5 h-5 w-5 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p id="study-material-hint" className="text-sm text-slate-500 dark:text-slate-400">
            Tip: more detail produces more specific flashcards and quiz questions.
          </p>
          <p
            className={`flex-none text-xs font-medium tabular-nums ${
              charCount > 4000 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
            }`}
            aria-live="polite"
          >
            {charCount.toLocaleString()} characters
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-700 dark:bg-slate-800/40">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
          Try a topic
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((topic) => {
            const isActive = value.trim().toLowerCase() === topic.toLowerCase()
            return (
              <button
                key={topic}
                type="button"
                onClick={() => onFillSuggestion(topic)}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
              >
                {isActive ? (
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
                )}
                {topic}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StudyInput