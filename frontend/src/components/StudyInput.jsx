import { useEffect, useRef } from 'react'

const SUGGESTIONS = [
  'Binary Search',
  'DBMS Normalization',
  'Operating Systems',
  'Computer Networks',
  'React Hooks',
]

function StudyInput({ value, onChange, onFillSuggestion }) {
  const charCount = value.length
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) {
      return
    }
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label
          htmlFor="study-material"
          className="block text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          Your notes or topic
        </label>
        <textarea
          id="study-material"
          name="study-material"
          ref={textareaRef}
          value={value}
          onChange={onChange}
          rows={4}
          wrap="soft"
          placeholder="Paste your notes here, or describe a topic — e.g. 'binary search algorithm'"
          className="mt-1.5 block min-h-24 w-full resize-none overflow-hidden rounded-xl border border-stone-300/90 bg-white/80 px-3.5 py-2.5 text-sm text-stone-900 shadow-[inset_0_1px_2px_rgb(120_104_80/0.05)] transition placeholder:text-stone-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 dark:border-stone-700 dark:bg-paper-dark/80 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/25"
          aria-describedby="study-material-hint"
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p
            className={`flex-none text-xs font-medium tabular-nums ${
              charCount > 4000 ? 'text-amber-700 dark:text-amber-400' : 'text-stone-400 dark:text-stone-500'
            }`}
            aria-live="polite"
          >
            {charCount.toLocaleString()} characters
          </p>
        </div>
      </div>

      {value.trim().length === 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-xs font-medium uppercase tracking-wide text-stone-400 dark:text-stone-500">
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
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all lg:hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 ${
                    isActive
                      ? 'border-amber-600/70 bg-amber-50 text-amber-800 dark:border-amber-500/60 dark:bg-amber-500/10 dark:text-amber-400'
                      : 'border-stone-200/90 bg-white/70 text-stone-600 hover:border-amber-500/60 hover:bg-white hover:text-amber-800 dark:border-stone-700 dark:bg-paper-dark/60 dark:text-stone-300 dark:hover:border-amber-500/40 dark:hover:text-amber-500'
                  }`}
                >
                  {topic}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyInput