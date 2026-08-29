import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import Flashcard from './Flashcard.jsx'
import FlashcardControls from './FlashcardControls.jsx'

const kbdClass =
  'rounded border border-slate-300 bg-slate-50 px-1 font-mono text-[11px] text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'

function FlashcardSection({ flashcards }) {
  const cards = Array.isArray(flashcards) ? flashcards : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (cards.length === 0) {
      return undefined
    }

    const isInteractiveTarget = (target) =>
      target instanceof HTMLButtonElement ||
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)

    const onKeyDown = (event) => {
      if (isInteractiveTarget(event.target)) {
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : prev))
        setIsFlipped(false)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
        setIsFlipped(false)
      } else if (event.key === ' ') {
        event.preventDefault()
        setIsFlipped((prev) => !prev)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cards.length])

  if (cards.length === 0) {
    return (
      <section
        aria-label="Flashcards"
        className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <Layers className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" aria-hidden="true" />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No flashcards to show.</p>
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
    <section aria-label="Flashcards" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Flashcards
          </h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            <kbd className={kbdClass}>←</kbd> <kbd className={kbdClass}>→</kbd> navigate ·{' '}
            <kbd className={kbdClass}>Space</kbd> flip
          </p>
        </div>
        <span className="flex-none rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {cards.length} cards
        </span>
      </div>

      <div
        className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-label="Flashcard progress"
        aria-valuemin={0}
        aria-valuemax={cards.length}
        aria-valuenow={currentIndex + 1}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full rounded-full bg-indigo-500"
        />
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <Flashcard card={card} isFlipped={isFlipped} onFlip={flip} />
      </motion.div>

      <p
        className="text-center text-sm font-medium text-slate-500 dark:text-slate-400"
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