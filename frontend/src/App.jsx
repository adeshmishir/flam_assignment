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
import { streamStudyMaterial, refineStudyMaterial } from './services/studyApi.js'
import { useTheme } from './hooks/useTheme.js'
import { useSessions } from './hooks/useSessions.js'

function BackgroundDecor() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_0%,transparent_70%)] dark:opacity-40" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-blob dark:bg-indigo-500/15" />
      <div className="absolute top-1/4 -right-40 h-[28rem] w-[28rem] rounded-full bg-violet-400/20 blur-3xl animate-blob [animation-delay:-6s] dark:bg-violet-500/15" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl animate-blob [animation-delay:-12s] dark:bg-fuchsia-500/10" />
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
  const [streamText, setStreamText] = useState('')

  const [isRefining, setIsRefining] = useState(false)
  const [refineError, setRefineError] = useState(null)

  const { theme, toggleTheme } = useTheme()
  const { sessions, saveSession, deleteSession } = useSessions()

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
    setStreamText('')

    try {
      const data = await streamStudyMaterial(trimmed, {
        signal: controller.signal,
        onProgress: (text) => {
          if (requestId === requestIdRef.current) {
            setStreamText(text)
          }
        },
      })

      if (requestId !== requestIdRef.current) {
        return
      }

      setStreamText('')
      setGenerationKey(requestId)
      setStudyData(data)
      setStatus('success')
      saveSession(data, trimmed)
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }

      if (requestId !== requestIdRef.current) {
        return
      }

      setStreamText('')
      setError(err.message)
      setStatus('error')
    }
  }

  const handleRefine = async (instruction) => {
    if (!studyData) {
      return
    }

    const requestId = ++requestIdRef.current

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsRefining(true)
    setRefineError(null)

    try {
      const data = await refineStudyMaterial(studyData, instruction, {
        signal: controller.signal,
      })

      if (requestId !== requestIdRef.current) {
        return
      }

      setGenerationKey((prev) => prev + 1)
      setStudyData(data)
      setIsRefining(false)
      saveSession(data, notes)
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }

      if (requestId !== requestIdRef.current) {
        return
      }

      setRefineError(err.message)
      setIsRefining(false)
    }
  }

  const handleLoadSession = (session) => {
    abortControllerRef.current?.abort()
    setIsRefining(false)
    setError(null)
    setRefineError(null)
    setStreamText('')
    setNotes(session.prompt || '')
    setStudyData(session.data)
    setGenerationKey((prev) => prev + 1)
    setStatus('success')

    window.setTimeout(() => {
      scrollToResults()
    }, 60)
  }

  const handleStartOver = () => {
    setNotes('')
    setStudyData(null)
    setStatus('idle')
    setError(null)
    setRefineError(null)
    setStreamText('')
    setIsRefining(false)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <BackgroundDecor />
      <NavBar
        hasMaterial={Boolean(studyData)}
        onStartOver={handleStartOver}
        theme={theme}
        onToggleTheme={toggleTheme}
        sessions={sessions}
        onLoadSession={handleLoadSession}
        onDeleteSession={deleteSession}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 pb-16 sm:px-6 sm:py-2 lg:px-8">
        <Header />

        <motion.section
          aria-label="Create study material"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
          className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-xl shadow-indigo-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/40"
        >
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-white/40 to-violet-50/60 px-6 py-5 dark:border-slate-800 dark:from-indigo-500/10 dark:via-slate-900/40 dark:to-violet-500/10 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/30">
                <FileText className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                  What would you like to study?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
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

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 dark:text-indigo-400" aria-hidden="true" />
                Generates Flashcards, quizzes & visual blocks.
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
              <LoadingState streamText={streamText} />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div key="error" className="mx-auto w-full max-w-3xl" {...stateMotion}>
              <ErrorState message={error} onRetry={handleGenerate} />
            </motion.div>
          )}

          {status === 'success' && studyData && (
            <motion.div key={`result-${generationKey}`} {...stateMotion}>
              <StudyMaterial
                data={studyData}
                onRefine={handleRefine}
                isRefining={isRefining}
                refineError={refineError}
              />
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