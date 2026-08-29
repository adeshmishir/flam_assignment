import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, ListChecks } from 'lucide-react'
import Overview from './Overview.jsx'
import FlashcardSection from './FlashcardSection.jsx'
import QuizSection from './QuizSection.jsx'
import RefinePanel from './RefinePanel.jsx'

const TABS = [
  { id: 'flashcards', label: 'Flashcards', icon: BrainCircuit },
  { id: 'quiz', label: 'Quiz', icon: ListChecks },
]

function StudyMaterial({ data, onRefine, isRefining, refineError }) {
  const [activeTab, setActiveTab] = useState('flashcards')
  const tabRefs = useRef([])

  const handleTablistKeyDown = (event) => {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab)
    let nextIndex = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % TABS.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = TABS.length - 1
    }

    if (nextIndex !== null) {
      event.preventDefault()
      setActiveTab(TABS[nextIndex].id)
      tabRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <motion.section
      aria-label="Study material"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col gap-8"
    >
      <Overview title={data.title} summary={data.summary} blocks={data.blocks} />

      <div className="flex flex-col gap-5">
        <div
          role="tablist"
          aria-label="Pick a practice mode"
          onKeyDown={handleTablistKeyDown}
          className="inline-flex self-start rounded-xl border border-stone-200/80 bg-stone-200/50 p-1 dark:border-stone-700/70 dark:bg-stone-800/40"
        >
          {TABS.map((tab, index) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 ${
                  active
                    ? 'bg-white/80 text-stone-900 shadow-paper dark:bg-paper-soft-dark dark:text-white'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div role="tabpanel" hidden={activeTab !== 'flashcards'}>
          <FlashcardSection flashcards={data.flashcards} />
        </div>

        <div role="tabpanel" hidden={activeTab !== 'quiz'}>
          <QuizSection quiz={data.quiz} />
        </div>
      </div>

      <RefinePanel onRefine={onRefine} isRefining={isRefining} error={refineError} />
    </motion.section>
  )
}

export default StudyMaterial