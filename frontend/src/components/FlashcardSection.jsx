import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import Flashcard from './Flashcard.jsx'
import FlashcardControls from './FlashcardControls.jsx'

function FlashcardSection({ flashcards }) {
  const cards = Array.isArray(flashcards) ? flashcards : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  if (cards.length === 0) {
    return (
      <section
        aria-label="Flashcards"
        className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm"
      >
        <Layers className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
        <p className="mt-3 text-sm text-slate-500">No flashcards to show.</p>
      </section>
    )
  }

  const card = cards[currentIndex]
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < cards.length - 1
  const progress = ((currentIndex + 1) / cards.length) * 100

  const goToCard = (nextIndex) => {
    setCurrentIndex(nextIndex)
    setIsFlipped(false)
  }

  const goPrev = () => {
    if (hasPrevious) {
      goToCard(currentIndex - 1)
    }
  }

  const goNext = () => {
    if (hasNext) {
      goToCard(currentIndex + 1)
    }
  }

  const flip = () => {
    setIsFlipped((prev) => !prev)
  }

  return (
    <section aria-label="Flashcards" className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/25">
            <Layers className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Flashcards
            </h3>
            <p className="text-sm text-slate-500">
              Click a card to flip between question and answer.
            </p>
          </div>
        </div>
        <span className="flex-none rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-500">
          {cards.length} cards
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
        />
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Flashcard card={card} isFlipped={isFlipped} onFlip={flip} />
      </motion.div>

      <p
        className="text-center text-sm font-semibold text-slate-500"
        aria-live="polite"
      >
        Card {currentIndex + 1} of {cards.length}
      </p>

      <FlashcardControls
        onPrevious={goPrev}
        onNext={goNext}
        onFlip={flip}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </section>
  )
}

export default FlashcardSection