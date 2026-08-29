import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuizSection from '../QuizSection.jsx'

const quiz = [
  { question: 'Q1', options: ['Q1A', 'Q1B', 'Q1C', 'Q1D'], answer: 0, explanation: 'E1' },
  { question: 'Q2', options: ['Q2A', 'Q2B', 'Q2C', 'Q2D'], answer: 1, explanation: 'E2' },
  { question: 'Q3', options: ['Q3A', 'Q3B', 'Q3C', 'Q3D'], answer: 2, explanation: 'E3' },
  { question: 'Q4', options: ['Q4A', 'Q4B', 'Q4C', 'Q4D'], answer: 3, explanation: 'E4' },
]

const single = [quiz[0]]

function questionCard(questionText) {
  const node = screen.getByText(questionText)
  const card = node.closest('li')
  if (!card) {
    throw new Error(`No card found for ${questionText}`)
  }
  return card
}

async function answerIn(user, card, optionText) {
  await user.click(within(card).getByRole('radio', { name: optionText }))
  await user.click(within(card).getByRole('button', { name: 'Submit Answer' }))
}

// Matches text that is broken up by child elements (e.g. <p>Correct: <span>2</span></p>).
function textOf(regex) {
  return (_content, element) => !!element && !!element.textContent && regex.test(element.textContent)
}

describe('QuizSection', () => {
  it('renders every question at once with all options', () => {
    render(<QuizSection quiz={quiz} />)
    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()
    expect(screen.getByText('Q3')).toBeInTheDocument()
    expect(screen.getByText('Q4')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(16)
    expect(screen.getByText('Score: 0 / 4')).toBeInTheDocument()
  })

  it('starts with Submit disabled on every question until an option is selected', () => {
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)
    const buttons = screen.getAllByRole('button', { name: 'Submit Answer' })
    expect(buttons).toHaveLength(2)
    buttons.forEach((button) => expect(button).toBeDisabled())
  })

  it('shows correct feedback and updates the score for a correct answer', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    await answerIn(user, questionCard('Q1'), 'Q1A')

    expect(screen.getByText('Correct!')).toBeInTheDocument()
    expect(screen.getByText(/Explanation: E1/)).toBeInTheDocument()
    expect(screen.getByText('Score: 1 / 2')).toBeInTheDocument()
    // Only the answered question is locked.
    expect(within(questionCard('Q1')).getByRole('radio', { name: 'Q1A' })).toBeDisabled()
    expect(within(questionCard('Q2')).getByRole('radio', { name: 'Q2A' })).toBeEnabled()
  })

  it('shows incorrect feedback and the correct answer on a wrong submission', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={single} />)

    await answerIn(user, questionCard('Q1'), 'Q1B') // correct is Q1A

    expect(screen.getByText('Incorrect.')).toBeInTheDocument()
    expect(screen.getByText('Correct answer: Q1A')).toBeInTheDocument()
    expect(screen.getByText(/Explanation: E1/)).toBeInTheDocument()
    expect(screen.getByText('Score: 0 / 1')).toBeInTheDocument()
  })

  it('shows a perfect-score summary when every question is answered correctly', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    await answerIn(user, questionCard('Q1'), 'Q1A')
    await answerIn(user, questionCard('Q2'), 'Q2B')

    expect(screen.getByText('Perfect Score!')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retry Wrong Answers' })).not.toBeInTheDocument()
  })

  it('shows a summary with a Retry button when wrong answers exist', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    await answerIn(user, questionCard('Q1'), 'Q1A') // correct
    await answerIn(user, questionCard('Q2'), 'Q2A') // wrong (correct Q2B)

    expect(screen.getByText('Quiz Complete!')).toBeInTheDocument()
    expect(screen.getByText(textOf(/^Correct: 1$/))).toBeInTheDocument()
    expect(screen.getByText(textOf(/^Incorrect: 1$/))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry Wrong Answers' })).toBeInTheDocument()
  })

  it('retries only the wrong questions and keeps the correct ones locked', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1], quiz[2]]} />)

    await answerIn(user, questionCard('Q1'), 'Q1A') // correct
    await answerIn(user, questionCard('Q2'), 'Q2A') // wrong (correct Q2B)
    await answerIn(user, questionCard('Q3'), 'Q3C') // correct

    await user.click(screen.getByRole('button', { name: 'Retry Wrong Answers' }))

    // The wrong question resets, the correct ones stay answered.
    expect(within(questionCard('Q2')).queryByText('Incorrect.')).not.toBeInTheDocument()
    expect(within(questionCard('Q1')).getByText('Correct!')).toBeInTheDocument()
    expect(within(questionCard('Q3')).getByText('Correct!')).toBeInTheDocument()
    expect(within(questionCard('Q2')).getByRole('radio', { name: 'Q2A' })).toBeEnabled()
  })

  it('handles an empty quiz gracefully', () => {
    render(<QuizSection quiz={[]} />)
    expect(screen.getByText('No quiz questions to show.')).toBeInTheDocument()
  })

  it('does not crash when quiz is undefined', () => {
    render(<QuizSection quiz={undefined} />)
    expect(screen.getByText('No quiz questions to show.')).toBeInTheDocument()
  })

  it('does not crash when quiz is null', () => {
    render(<QuizSection quiz={null} />)
    expect(screen.getByText('No quiz questions to show.')).toBeInTheDocument()
  })
})