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
  await user.click(within(card).getByRole('button', { name: 'Submit' }))
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
    const buttons = screen.getAllByRole('button', { name: 'Submit' })
    expect(buttons).toHaveLength(2)
    buttons.forEach((button) => expect(button).toBeDisabled())
  })

  it('highlights the correct option and updates the score on a correct answer', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    await answerIn(user, questionCard('Q1'), 'Q1A')

    expect(screen.getByText('Score: 1 / 2')).toBeInTheDocument()
    // No textual right/wrong verdict anymore — a Retry button appears instead.
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument()
    expect(within(questionCard('Q1')).getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    // Only the answered question is locked.
    expect(within(questionCard('Q1')).getByRole('radio', { name: 'Q1A' })).toBeDisabled()
    expect(within(questionCard('Q2')).getByRole('radio', { name: 'Q2A' })).toBeEnabled()
  })

  it('offers a Retry on a wrong submission without revealing the verdict as text', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={single} />)

    await answerIn(user, questionCard('Q1'), 'Q1B') // correct is Q1A

    expect(screen.queryByText('Incorrect.')).not.toBeInTheDocument()
    expect(screen.queryByText('Correct answer: Q1A')).not.toBeInTheDocument()
    expect(screen.getByText('Score: 0 / 1')).toBeInTheDocument()
    expect(within(questionCard('Q1')).getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('resets a single question when its Retry button is used', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    await answerIn(user, questionCard('Q1'), 'Q1A') // correct
    await user.click(within(questionCard('Q1')).getByRole('button', { name: 'Retry' }))

    expect(within(questionCard('Q1')).getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    expect(within(questionCard('Q1')).getByRole('radio', { name: 'Q1A' })).toBeEnabled()
    expect(screen.getByText('Score: 0 / 2')).toBeInTheDocument()
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

  it('shows only the wrong questions, unmarked, after Retry Wrong Answers', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1], quiz[2]]} />)

    await answerIn(user, questionCard('Q1'), 'Q1A') // correct
    await answerIn(user, questionCard('Q2'), 'Q2A') // wrong (correct Q2B)
    await answerIn(user, questionCard('Q3'), 'Q3C') // correct

    await user.click(screen.getByRole('button', { name: 'Retry Wrong Answers' }))

    // Only the wrong question stays, with its options unmarked and ready to answer.
    expect(screen.getByText('Retry wrong answers')).toBeInTheDocument()
    expect(screen.queryByText('Q1')).not.toBeInTheDocument()
    expect(screen.queryByText('Q3')).not.toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()
    expect(within(questionCard('Q2')).getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    expect(within(questionCard('Q2')).queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument()
    expect(within(questionCard('Q2')).getByRole('radio', { name: 'Q2A' })).toBeEnabled()
    expect(within(questionCard('Q2')).getByRole('radio', { name: 'Q2A' })).not.toBeChecked()
    expect(within(questionCard('Q2')).getByRole('radio', { name: 'Q2B' })).not.toBeChecked()
  })

  it('shows a retry-complete summary and a way back to all questions', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    await answerIn(user, questionCard('Q1'), 'Q1B') // wrong (correct Q1A)
    await answerIn(user, questionCard('Q2'), 'Q2B') // correct

    await user.click(screen.getByRole('button', { name: 'Retry Wrong Answers' }))

    // Only Q1 is retried; answer it correctly.
    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.queryByText('Q2')).not.toBeInTheDocument()
    await answerIn(user, questionCard('Q1'), 'Q1A')

    expect(screen.getByText('Retry Complete!')).toBeInTheDocument()
    expect(screen.getByText(/Original Score: 1 \/ 2/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back to all questions' }))
    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()
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