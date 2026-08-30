import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudyMaterial from '../StudyMaterial.jsx'

const data = {
  title: 'React Basics',
  summary: 'A summary about React.',
  blocks: [
    { type: 'checklist', title: 'Checklist', items: ['Understand components', 'Understand state'] },
    { type: 'card', title: 'Quick tip', body: 'Hooks power state and effects.' },
  ],
  flashcards: [
    { question: 'FC Q', answer: 'FC A' },
    { question: 'FC Q2', answer: 'FC A2' },
    { question: 'FC Q3', answer: 'FC A3' },
    { question: 'FC Q4', answer: 'FC A4' },
  ],
  quiz: [
    { question: 'Quiz Q1', options: ['a', 'b', 'c', 'd'], answer: 0, explanation: 'e' },
    { question: 'Quiz Q2', options: ['a', 'b', 'c', 'd'], answer: 1, explanation: 'e' },
    { question: 'Quiz Q3', options: ['a', 'b', 'c', 'd'], answer: 2, explanation: 'e' },
    { question: 'Quiz Q4', options: ['a', 'b', 'c', 'd'], answer: 3, explanation: 'e' },
  ],
}

function renderMaterial() {
  return render(<StudyMaterial data={data} onRefine={vi.fn()} isRefining={false} refineError={null} />)
}

describe('StudyMaterial', () => {
  it('keeps the main explanation and key insights together in one overview', () => {
    renderMaterial()
    expect(screen.getByRole('heading', { name: 'React Basics' })).toBeInTheDocument()
    expect(screen.getByText('A summary about React.')).toBeInTheDocument()
    expect(screen.getByText('Key insights')).toBeInTheDocument()
    expect(screen.getByText('Understand components')).toBeInTheDocument()
    expect(screen.getByText('Hooks power state and effects.')).toBeInTheDocument()
  })

  it('shows all quiz questions by default and hides the flashcards', () => {
    renderMaterial()
    expect(screen.getByText('Quiz Q1')).toBeInTheDocument()
    expect(screen.getByText('FC Q')).not.toBeVisible()
  })

  it('switches to show every quiz question at once', async () => {
    const user = userEvent.setup()
    renderMaterial()

    await user.click(screen.getByRole('tab', { name: 'Quiz' }))

    expect(screen.getByText('Quiz Q1')).toBeInTheDocument()
    expect(screen.getByText('Quiz Q2')).toBeInTheDocument()
    expect(screen.getByText('FC Q')).not.toBeVisible()
  })

  it('switches tabs with arrow keys and keeps focus on the tab', async () => {
    const user = userEvent.setup()
    renderMaterial()

    const quizTab = screen.getByRole('tab', { name: 'Quiz' })
    quizTab.focus()
    await user.keyboard('{ArrowRight}')

    const flashcardsTab = screen.getByRole('tab', { name: 'Flashcards' })
    expect(flashcardsTab).toHaveAttribute('aria-selected', 'true')
    expect(flashcardsTab).toHaveFocus()
    expect(screen.getByText('FC Q')).toBeInTheDocument()

    await user.keyboard('{End}')
    expect(quizTab).toHaveAttribute('aria-selected', 'true')
    expect(quizTab).toHaveFocus()
  })

  it('keeps quiz progress when switching tabs', async () => {
    const user = userEvent.setup()
    renderMaterial()

    await user.click(screen.getByRole('tab', { name: 'Quiz' }))
    const firstQuestion = screen.getByText('Quiz Q1').closest('li')
    await user.click(within(firstQuestion).getByRole('radio', { name: 'a' }))
    await user.click(within(firstQuestion).getByRole('button', { name: 'Submit Answer' }))
    expect(screen.getByText('Correct!')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Flashcards' }))
    await user.click(screen.getByRole('tab', { name: 'Quiz' }))
    expect(screen.getByText('Correct!')).toBeInTheDocument()
  })
})