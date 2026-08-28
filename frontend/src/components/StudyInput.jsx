function StudyInput({ value, onChange, disabled }) {
  return (
    <div>
      <label htmlFor="study-material" className="block text-sm font-semibold text-slate-700">
        Your notes or topic
      </label>
      <textarea
        id="study-material"
        name="study-material"
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={8}
        placeholder="Paste your notes here, or describe a topic — e.g. 'binary search algorithm'"
        className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-40 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      />
      <p className="mt-2 text-sm text-slate-500">
        Tip: more detail produces more specific flashcards and quiz questions.
      </p>
    </div>
  )
}

export default StudyInput
