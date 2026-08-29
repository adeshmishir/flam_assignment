import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuizSection from '../QuizSection.jsx'

const quiz = [
  { question: 'Q1', options: ['Q1A', 'Q1B', 'Q1C', 'Q1D'], answer: 0, explanation: 'E1' },
  { question: 'Q2', options: ['Q2A', 'Q2B', 'Q2C', 'Q2D'], answer: 1, explanation: 'E2' },
  { question: 'Q3', options: ['Q3A', 'Q3B', 'Q3C', 'Q3D'], answer: 2, explanation: 'E3' },
  { question: 'Q4', options: ['Q4A', 'Q4B', 'Q4C', 'Q4D'], answer: 3, explanation: 'E4' },
]

const single = [quiz[0]]

async function answer(user, optionText) {
  await user.click(screen.getByRole('radio', { name: optionText }))
  await user.click(screen.getByRole('button', { name: 'Submit Answer' }))
}

// Matches text that is broken up by child elements (e.g. <p>Correct: <span>2</span></p>).
function textOf(regex) {
  return (_content, element) => !!element && !!element.textContent && regex.test(element.textContent)
}

describe('QuizSection', () => {
  it('shows the first question and all four options', () => {
    render(<QuizSection quiz={quiz} />)
    expect(screen.getByText('Question 1 of 4')).toBeInTheDocument()
    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(4)
  })

  it('disables Submit until an option is selected', () => {
    render(<QuizSection quiz={quiz} />)
    expect(screen.getByRole('button', { name: 'Submit Answer' })).toBeDisabled()
  })

  it('shows correct feedback, explanation, locks the answer and shows Next on a correct answer', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    await answer(user, 'Q1A')

    expect(screen.getByText('Correct!')).toBeInTheDocument()
    expect(screen.getByText(/Explanation: E1/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next Question' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Submit Answer' })).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Q1A' })).toBeDisabled()
  })

  it('shows incorrect feedback and the correct answer on a wrong submission', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={single} />)

    await answer(user, 'Q1B') // correct is Q1A

    expect(screen.getByText('Incorrect.')).toBeInTheDocument()
    expect(screen.getByText('Correct answer: Q1A')).toBeInTheDocument()
    expect(screen.getByText(/Explanation: E1/)).toBeInTheDocument()
  })

  it('does not allow re-submission after answering a single question', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={single} />)

    await answer(user, 'Q1A')
    // Submit button is gone and options are disabled; score shows 1 / 1 once.
    expect(screen.getByText('Score: 1 / 1')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Submit Answer' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('radio').every((el) => el.disabled)).toBe(true)
  })

  it('resets selection and feedback when moving to the next question', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={quiz} />)

    await answer(user, 'Q1A')
    await user.click(screen.getByRole('button', { name: 'Next Question' }))

    expect(screen.getByText('Question 2 of 4')).toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument()
    expect(screen.getAllByRole('radio').some((el) => !el.disabled)).toBe(true)
  })

  it('shows Quiz Complete and a correct score at the end', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    await answer(user, 'Q1A') // correct
    await user.click(screen.getByRole('button', { name: 'Next Question' }))
    await answer(user, 'Q2A') // wrong (correct is Q2B)
    await user.click(screen.getByRole('button', { name: 'Finish Quiz' }))

    expect(screen.getByText('Quiz Complete!')).toBeInTheDocument()
    expect(screen.getByText(textOf(/^Correct: 1$/))).toBeInTheDocument()
    expect(screen.getByText(textOf(/^Incorrect: 1$/))).toBeInTheDocument()
  })

  it('shows a perfect-score result without a Retry button when everything is correct', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0]]} />)

    await answer(user, 'Q1A')
    await user.click(screen.getByRole('button', { name: 'Finish Quiz' }))

    expect(screen.getByText('Perfect Score!')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retry Wrong Answers' })).not.toBeInTheDocument()
  })

  it('retries only the wrong questions', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={quiz} />)

    await answer(user, 'Q1A') // correct
    await user.click(screen.getByRole('button', { name: 'Next Question' }))
    await answer(user, 'Q2A') // wrong (correct Q2B)
    await user.click(screen.getByRole('button', { name: 'Next Question' }))
    await answer(user, 'Q3C') // correct
    await user.click(screen.getByRole('button', { name: 'Next Question' }))
    await answer(user, 'Q4A') // wrong (correct Q4D)
    await user.click(screen.getByRole('button', { name: 'Finish Quiz' }))

    expect(screen.getByText('Quiz Complete!')).toBeInTheDocument()
    expect(screen.getByText(textOf(/^Correct: 2$/))).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry Wrong Answers' }))

    // Only Q2 and Q4 should be presented.
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()
    expect(screen.queryByText('Q1')).not.toBeInTheDocument()
  })

  it('keeps the retry score independent and starts retry fresh', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1], quiz[2]]} />)

    // Q1 correct, Q2 wrong, Q3 correct -> original score 2 / 3
    await answer(user, 'Q1A')
    await user.click(screen.getByRole('button', { name: 'Next Question' }))
    await answer(user, 'Q2A')
    await user.click(screen.getByRole('button', { name: 'Next Question' }))
    await answer(user, 'Q3C')
    await user.click(screen.getByRole('button', { name: 'Finish Quiz' }))

    await user.click(screen.getByRole('button', { name: 'Retry Wrong Answers' }))

    // First retry question starts fresh: no feedback, no preselection, Submit disabled.
    expect(screen.getByText('Q2')).toBeInTheDocument()
    expect(screen.getByText('Score: 0 / 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit Answer' })).toBeDisabled()

    await answer(user, 'Q2B') // correct in retry
    await user.click(screen.getByRole('button', { name: 'Finish Quiz' }))

    expect(screen.getByText('Retry Complete!')).toBeInTheDocument()
    expect(screen.getByText('Original Score: 2 / 3')).toBeInTheDocument()
    // Every retried question was answered correctly, so no further retest is offered.
    expect(screen.queryByRole('button', { name: 'Retest Wrong Answers' })).not.toBeInTheDocument()
  })

  it('offers a retest loop for questions still wrong after a retry', async () => {
    const user = userEvent.setup()
    render(<QuizSection quiz={[quiz[0], quiz[1]]} />)

    // Q1 correct, Q2 wrong -> original score 1 / 2
    await answer(user, 'Q1A')
    await user.click(screen.getByRole('button', { name: 'Next Question' }))
    await answer(user, 'Q2A')
    await user.click(screen.getByRole('button', { name: 'Finish Quiz' }))

    await user.click(screen.getByRole('button', { name: 'Retry Wrong Answers' }))

    // Q2 is retried but answered wrong again.
    await answer(user, 'Q2A')
    await user.click(screen.getByRole('button', { name: 'Finish Quiz' }))

    expect(screen.getByText('Retry Complete!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retest Wrong Answers' })).toBeInTheDocument()

    // Retest drills only Q2 once more.
    await user.click(screen.getByRole('button', { name: 'Retest Wrong Answers' }))
    expect(screen.getByText('Question 1 of 1')).toBeInTheDocument()
    expect(screen.getByText('Q2')).toBeInTheDocument()

    await answer(user, 'Q2B') // correct this time
    await user.click(screen.getByRole('button', { name: 'Finish Quiz' }))

    expect(screen.getByText('Retry Complete!')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retest Wrong Answers' })).not.toBeInTheDocument()
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
