import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlashcardSection from '../FlashcardSection.jsx'

const flashcards = [
  { question: 'Question 1', answer: 'Answer 1' },
  { question: 'Question 2', answer: 'Answer 2' },
  { question: 'Question 3', answer: 'Answer 3' },
]

describe('FlashcardSection', () => {
  it('renders all flashcards at once', () => {
    render(<FlashcardSection flashcards={flashcards} />)
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('Question 2')).toBeInTheDocument()
    expect(screen.getByText('Question 3')).toBeInTheDocument()
    expect(screen.getByText('3 cards')).toBeInTheDocument()
    // Answers stay hidden until a card is flipped.
    expect(screen.queryByText('Answer 1')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Flip card' })).toHaveLength(3)
  })

  it('flips a single card to reveal its answer independently', async () => {
    const user = userEvent.setup()
    render(<FlashcardSection flashcards={flashcards} />)

    await user.click(screen.getAllByRole('button', { name: 'Flip card' })[0])

    const flipped = screen.getAllByRole('button', { name: 'Flip card' })
    expect(flipped[0]).toHaveAttribute('aria-pressed', 'true')
    expect(flipped[1]).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Answer 1')).toBeInTheDocument()
    expect(screen.queryByText('Answer 2')).not.toBeInTheDocument()
  })

  it('flips the card back to the question on a second click', async () => {
    const user = userEvent.setup()
    render(<FlashcardSection flashcards={[flashcards[0]]} />)

    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    expect(screen.getByText('Answer 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    expect(screen.queryByText('Answer 1')).not.toBeInTheDocument()
    expect(screen.getByText('Question 1')).toBeInTheDocument()
  })

  it('moves focus between cards with arrow keys', async () => {
    const user = userEvent.setup()
    render(<FlashcardSection flashcards={flashcards} />)

    const cards = screen.getAllByRole('button', { name: 'Flip card' })
    cards[0].focus()

    await user.keyboard('{ArrowRight}')
    expect(cards[1]).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(cards[0]).toHaveFocus()

    await user.keyboard('{End}')
    expect(cards[2]).toHaveFocus()

    await user.keyboard('{Home}')
    expect(cards[0]).toHaveFocus()
  })

  it('handles an empty flashcards list', () => {
    render(<FlashcardSection flashcards={[]} />)
    expect(screen.getByText('No flashcards to show.')).toBeInTheDocument()
  })

  it('does not crash when flashcards is undefined', () => {
    render(<FlashcardSection flashcards={undefined} />)
    expect(screen.getByText('No flashcards to show.')).toBeInTheDocument()
  })

  it('does not crash when flashcards is null', () => {
    render(<FlashcardSection flashcards={null} />)
    expect(screen.getByText('No flashcards to show.')).toBeInTheDocument()
  })
})