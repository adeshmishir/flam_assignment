import { z } from 'zod'

const flashcardSchema = z.object({
  question: z.string().min(1, 'Flashcard question must be non-empty'),
  answer: z.string().min(1, 'Flashcard answer must be non-empty'),
})

const quizQuestionSchema = z.object({
  question: z.string().min(1, 'Quiz question must be non-empty'),
  options: z
    .array(z.string().min(1, 'Option must be non-empty'))
    .length(4, 'Quiz question must have exactly 4 options'),
  answer: z
    .number()
    .int('Answer must be an integer')
    .min(0, 'Answer index must be at least 0')
    .max(3, 'Answer index must be at most 3'),
  explanation: z.string().min(1, 'Explanation must be non-empty'),
})

export const studyResponseSchema = z.object({
  title: z.string().min(1, 'Title must be non-empty'),
  summary: z.string().min(1, 'Summary must be non-empty'),
  flashcards: z.array(flashcardSchema).min(1, 'At least one flashcard required'),
  quiz: z.array(quizQuestionSchema).min(1, 'At least one quiz question required'),
})
