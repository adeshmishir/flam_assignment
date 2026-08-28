import { useState } from 'react'
import Flashcard from './Flashcard.jsx'
import FlashcardControls from './FlashcardControls.jsx'

function FlashcardSection({ flashcards }) {
  const cards = Array.isArray(flashcards) ? flashcards : []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  if (cards.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-slate-600">No flashcards to show.</p>
      </section>
    )
  }

  const card = cards[currentIndex]
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < cards.length - 1

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
      <h2 className="text-xl font-semibold text-slate-900">Flashcards</h2>
      <Flashcard card={card} isFlipped={isFlipped} onFlip={flip} />
      <p className="text-center text-sm text-slate-500" aria-live="polite">
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
