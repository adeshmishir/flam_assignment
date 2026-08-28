import { useEffect, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import StudyInput from './components/StudyInput.jsx'
import GenerateButton from './components/GenerateButton.jsx'
import EmptyState from './components/EmptyState.jsx'
import LoadingState from './components/LoadingState.jsx'
import ErrorState from './components/ErrorState.jsx'
import FlashcardSection from './components/FlashcardSection.jsx'
import QuizSection from './components/QuizSection.jsx'
import { generateStudyMaterial } from './services/studyApi.js'

function App() {
  const [notes, setNotes] = useState('')
  const [studyData, setStudyData] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const abortControllerRef = useRef(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const handleChange = (event) => {
    setNotes(event.target.value)
  }

  const hasValidInput = notes.trim().length > 0
  const isLoading = status === 'loading'

  const handleGenerate = async () => {
    const trimmed = notes.trim()
    if (!trimmed) {
      return
    }

    const requestId = ++requestIdRef.current

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setStatus('loading')
    setError(null)
    setStudyData(null)

    try {
      const data = await generateStudyMaterial(trimmed, {
        signal: controller.signal,
      })

      if (requestId !== requestIdRef.current) {
        return
      }

      setStudyData(data)
      setStatus('success')
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }

      if (requestId !== requestIdRef.current) {
        return
      }

      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:py-16">
        <Header />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">
            <StudyInput value={notes} onChange={handleChange} />
            <div className="flex flex-col items-center gap-4">
              <GenerateButton
                onClick={handleGenerate}
                disabled={!hasValidInput}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>

        {status === 'idle' && <EmptyState />}

        {status === 'loading' && <LoadingState />}

        {status === 'error' && <ErrorState message={error} onRetry={handleGenerate} />}

        {status === 'success' && studyData && (
          <section aria-label="Study material" className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Study Material</h2>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{studyData.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{studyData.summary}</p>
              </div>
            </div>

            <FlashcardSection flashcards={studyData.flashcards} />

            <QuizSection quiz={studyData.quiz} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
