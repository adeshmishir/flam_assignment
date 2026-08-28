import { useState } from 'react'
import Header from './components/Header.jsx'
import StudyInput from './components/StudyInput.jsx'
import GenerateButton from './components/GenerateButton.jsx'
import EmptyState from './components/EmptyState.jsx'
import FlashcardSection from './components/FlashcardSection.jsx'
import { generateStudyMaterial } from './services/studyApi.js'

function App() {
  const [notes, setNotes] = useState('')
  const [studyData, setStudyData] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    setNotes(event.target.value)
  }

  const hasValidInput = notes.trim().length > 0
  const isLoading = status === 'loading'

  const handleGenerate = async () => {
    const trimmed = notes.trim()
    if (!trimmed || isLoading) {
      return
    }

    setStatus('loading')
    setError(null)
    setStudyData(null)

    try {
      const data = await generateStudyMaterial(trimmed)
      setStudyData(data)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const showEmptyState = status === 'idle' || status === 'error'

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:py-16">
        <Header />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">
            <StudyInput value={notes} onChange={handleChange} disabled={isLoading} />
            <div className="flex flex-col items-center gap-4">
              <GenerateButton
                onClick={handleGenerate}
                disabled={!hasValidInput}
                isLoading={isLoading}
              />
              {error && (
                <p className="text-center text-sm font-medium text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        </section>

        {showEmptyState && <EmptyState />}

        {status === 'success' && studyData && (
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Study Material</h2>
              <h3 className="mt-1 text-lg font-medium text-slate-800">{studyData.title}</h3>
              <p className="mt-2 text-slate-600">{studyData.summary}</p>
            </div>

            <FlashcardSection flashcards={studyData.flashcards} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
