import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PanelLeftOpen } from 'lucide-react'
import NavBar from './components/NavBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import StudyInput from './components/StudyInput.jsx'
import GenerateButton from './components/GenerateButton.jsx'
import LoadingState from './components/LoadingState.jsx'
import ErrorState from './components/ErrorState.jsx'
import StudyMaterial from './components/StudyMaterial.jsx'
import Footer from './components/Footer.jsx'
import { streamStudyMaterial, refineStudyMaterial } from './services/studyApi.js'
import { useTheme } from './hooks/useTheme.js'
import { useSessions } from './hooks/useSessions.js'

const stateMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
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
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }
    return window.localStorage.getItem('studymate:sidebar') !== '0'
  })

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

  useEffect(() => {
    window.localStorage.setItem('studymate:sidebar', sidebarOpen ? '1' : '0')
  }, [sidebarOpen])

  useEffect(() => {
    if (!drawerOpen) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [drawerOpen])

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
    setDrawerOpen(false)
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
    setDrawerOpen(false)
    setNotes('')
    setStudyData(null)
    setStatus('idle')
    setError(null)
    setRefineError(null)
    setStreamText('')
    setIsRefining(false)
  }

  return (
    <div className="min-h-screen bg-transparent text-stone-900 dark:text-stone-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-amber-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-paper"
      >
        Skip to content
      </a>

      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-stone-200/70 bg-paper-soft transition-[width] duration-300 ease-in-out dark:border-stone-800/70 dark:bg-paper-soft-dark lg:block ${
          sidebarOpen ? 'w-64 border-r' : 'w-0 border-transparent'
        }`}
      >
        <div className="h-full w-64">
          <Sidebar
            sessions={sessions}
            onLoadSession={handleLoadSession}
            onDeleteSession={deleteSession}
            hasMaterial={Boolean(studyData)}
            onStartOver={handleStartOver}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
        </div>
      </aside>

      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Show session sidebar"
          className="fixed left-0 top-1/2 z-30 hidden h-10 w-9 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-stone-200/80 bg-paper/80 text-stone-500 shadow-paper transition hover:text-amber-700 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-stone-700 dark:bg-paper-dark dark:text-stone-400 dark:hover:text-amber-500 lg:inline-flex"
        >
          <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      <div
        className={`relative flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ease-in-out ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        <NavBar
          drawerOpen={drawerOpen}
          onToggleDrawer={() => setDrawerOpen((prev) => !prev)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto flex w-full max-w-6xl flex-1 scroll-mt-24 flex-col gap-8 px-4 pt-8 pb-16 outline-none sm:px-6 sm:pt-10 lg:px-8"
        >
        <Header />

        <motion.section
          aria-label="Create study material"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-stone-200/70 bg-paper/70 shadow-paper transition focus-within:border-amber-600/60 focus-within:shadow-paper-focus dark:border-stone-700/60 dark:bg-paper-dark/70 dark:focus-within:border-amber-500/50"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"
          />
          <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
            <StudyInput
              value={notes}
              onChange={handleChange}
              onFillSuggestion={fillSuggestion}
            />

            <div className="flex justify-end border-t border-stone-200/70 pt-4 dark:border-stone-800/70">
              <GenerateButton
                onClick={handleGenerate}
                disabled={!hasValidInput}
                isLoading={isLoading}
              />
            </div>
          </div>
        </motion.section>

        <div ref={resultsRef} className="flex scroll-mt-24 flex-col gap-8">
          {status === 'loading' && (
            <motion.div key="loading" className="mx-auto w-full max-w-4xl" {...stateMotion}>
              <LoadingState streamText={streamText} />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div key="error" className="mx-auto w-full max-w-4xl" {...stateMotion}>
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
        </div>
      </main>

        <Footer />
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full cursor-default bg-stone-900/40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto [scrollbar-width:none] border-r border-stone-200/70 bg-paper-soft dark:border-stone-800/70 dark:bg-paper-soft-dark [&::-webkit-scrollbar]:hidden"
            >
              <Sidebar
                sessions={sessions}
                onLoadSession={handleLoadSession}
                onDeleteSession={deleteSession}
                hasMaterial={Boolean(studyData)}
                onStartOver={handleStartOver}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App