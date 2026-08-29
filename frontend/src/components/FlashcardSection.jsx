import { useRef, useState } from 'react'
import { Layers } from 'lucide-react'
import Flashcard from './Flashcard.jsx'

function FlashcardSection({ flashcards }) {
  const cards = Array.isArray(flashcards) ? flashcards : []
  const [flipped, setFlipped] = useState(() => new Set())
  const cardRefs = useRef([])

  if (cards.length === 0) {
    return (
      <section
        aria-label="Flashcards"
        className="rounded-2xl border border-stone-200/70 bg-paper/70 px-6 py-10 text-center shadow-paper dark:border-stone-700/60 dark:bg-paper-dark/70"
      >
        <Layers className="mx-auto h-7 w-7 text-stone-400 dark:text-stone-600" aria-hidden="true" />
        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">No flashcards to show.</p>
      </section>
    )
  }

  const toggleFlip = (index) => {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleGridKeyDown = (event) => {
    if (cards.length === 0) {
      return
    }

    const currentIndex = cardRefs.current.findIndex((el) => el === document.activeElement)
    let nextIndex = null

    if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = cards.length - 1
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % cards.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = currentIndex === -1 ? cards.length - 1 : (currentIndex - 1 + cards.length) % cards.length
    }

    if (nextIndex !== null) {
      event.preventDefault()
      cardRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <section aria-label="Flashcards" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-stone-900 dark:text-white">Flashcards</h3>
        <span className="flex-none rounded-full border border-stone-200/80 bg-white/60 px-2.5 py-1 text-xs font-semibold text-stone-600 dark:border-stone-700 dark:bg-paper-soft-dark/70 dark:text-stone-300">
          {cards.length} cards
        </span>
      </div>

      <div
        onKeyDown={handleGridKeyDown}
        className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {cards.map((card, index) => (
          <Flashcard
            key={card.id ?? index}
            card={card}
            isFlipped={flipped.has(index)}
            onFlip={() => toggleFlip(index)}
            buttonRef={(el) => {
              cardRefs.current[index] = el
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default FlashcardSection