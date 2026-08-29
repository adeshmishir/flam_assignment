const SUGGESTIONS = [
  'Binary Search',
  'DBMS Normalization',
  'Operating Systems',
  'Computer Networks',
  'React Hooks',
]

function StudyInput({ value, onChange, onFillSuggestion }) {
  const charCount = value.length

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="study-material"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Your notes or topic
        </label>
        <textarea
          id="study-material"
          name="study-material"
          value={value}
          onChange={onChange}
          rows={8}
          wrap="soft"
          placeholder="Paste your notes here, or describe a topic — e.g. 'binary search algorithm'"
          className="mt-2 block w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
          aria-describedby="study-material-hint"
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p id="study-material-hint" className="text-sm text-slate-500 dark:text-slate-400">
            More detail produces more specific flashcards and quiz questions.
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

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Try a topic
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((topic) => {
            const isActive = value.trim().toLowerCase() === topic.toLowerCase()
            return (
              <button
                key={topic}
                type="button"
                onClick={() => onFillSuggestion(topic)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
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