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
  it('shows the first card question and counter', () => {
    render(<FlashcardSection flashcards={flashcards} />)
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('Card 1 of 3')).toBeInTheDocument()
  })

  it('flips between question and answer when the card is clicked', async () => {
    const user = userEvent.setup()
    render(<FlashcardSection flashcards={flashcards} />)

    expect(screen.getByText('Question 1')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    expect(screen.getByText('Answer 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    expect(screen.getByText('Question 1')).toBeInTheDocument()
  })

  it('shows the Answer label after flipping', async () => {
    const user = userEvent.setup()
    render(<FlashcardSection flashcards={flashcards} />)
    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    expect(screen.getByText('Answer')).toBeInTheDocument()
  })

  it('navigates forward and backward', async () => {
    const user = userEvent.setup()
    render(<FlashcardSection flashcards={flashcards} />)

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Question 2')).toBeInTheDocument()
    expect(screen.getByText('Card 2 of 3')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('Card 1 of 3')).toBeInTheDocument()
  })

  it('disables Previous on the first card and Next on the last card', async () => {
    const user = userEvent.setup()
    render(<FlashcardSection flashcards={flashcards} />)

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Card 3 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('resets the flip state when moving to the next card', async () => {
    const user = userEvent.setup()
    render(<FlashcardSection flashcards={flashcards} />)

    await user.click(screen.getByRole('button', { name: 'Flip card' }))
    expect(screen.getByText('Answer 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Question 2')).toBeInTheDocument()
    expect(screen.queryByText('Answer 2')).not.toBeInTheDocument()
  })

  it('renders a friendly empty state for an empty flashcards array', () => {
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
