import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import NavBar from './components/NavBar.jsx'
import Header from './components/Header.jsx'
import StudyInput from './components/StudyInput.jsx'
import GenerateButton from './components/GenerateButton.jsx'
import EmptyState from './components/EmptyState.jsx'
import LoadingState from './components/LoadingState.jsx'
import ErrorState from './components/ErrorState.jsx'
import StudyMaterial from './components/StudyMaterial.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Footer from './components/Footer.jsx'
import { generateStudyMaterial } from './services/studyApi.js'

function BackgroundDecor() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_0%,transparent_70%)]" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-blob" />
      <div className="absolute top-1/4 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet-400/20 blur-3xl animate-blob [animation-delay:-6s]" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl animate-blob [animation-delay:-12s]" />
    </div>
  )
}

const stateMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' },
}

function App() {
  const [notes, setNotes] = useState('')
  const [studyData, setStudyData] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [generationKey, setGenerationKey] = useState(0)

  const abortControllerRef = useRef(null)
  const requestIdRef = useRef(0)
  const resultsRef = useRef(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  function scrollToResults() {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    resultsRef.current?.scrollIntoView?.({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    if (status === 'success') {
      scrollToResults()
    }
  }, [status])

  const handleChange = (event) => {
    setNotes(event.target.value)
  }

  const fillSuggestion = (topic) => {
    setNotes(topic)
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

      setGenerationKey(requestId)
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

  const handleStartOver = () => {
    setNotes('')
    setStudyData(null)
    setStatus('idle')
    setError(null)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <BackgroundDecor />
      <NavBar hasMaterial={Boolean(studyData)} onStartOver={handleStartOver} />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 pb-16 sm:px-6 sm:py-2 lg:px-8">
        <Header />

        <motion.section
          aria-label="Create study material"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
          className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-xl shadow-indigo-900/5 backdrop-blur"
        >
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-white/40 to-violet-50/60 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/30">
                <FileText className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  What would you like to study?
                </h2>
                <p className="text-sm text-slate-500">
                  Paste your notes or describe any topic.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 px-6 py-6 sm:px-8 sm:py-7">
            <StudyInput
              value={notes}
              onChange={handleChange}
              onFillSuggestion={fillSuggestion}
            />

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
                Generates flashcards and a quiz from your notes.
              </p>
              <GenerateButton
                onClick={handleGenerate}
                disabled={!hasValidInput}
                isLoading={isLoading}
              />
            </div>
          </div>
        </motion.section>

        <div ref={resultsRef} className="flex flex-col gap-10 scroll-mt-24">
          {status === 'idle' && (
            <motion.div key="idle" className="mx-auto w-full max-w-3xl" {...stateMotion}>
              <EmptyState />
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div key="loading" className="mx-auto w-full max-w-3xl" {...stateMotion}>
              <LoadingState />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div key="error" className="mx-auto w-full max-w-3xl" {...stateMotion}>
              <ErrorState message={error} onRetry={handleGenerate} />
            </motion.div>
          )}

          {status === 'success' && studyData && (
            <motion.div key={`result-${generationKey}`} {...stateMotion}>
              <StudyMaterial data={studyData} />
            </motion.div>
          )}

          <HowItWorks />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App