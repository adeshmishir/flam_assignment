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

const cardBlockSchema = z.object({
  type: z.literal('card'),
  title: z.string().min(1, 'Card title must be non-empty'),
  body: z.string().min(1, 'Card body must be non-empty'),
})

const chartBlockSchema = z.object({
  type: z.literal('chart'),
  title: z.string().min(1, 'Chart title must be non-empty'),
  subtitle: z.string().optional().default(''),
  unit: z.string().optional().default(''),
  labels: z.array(z.string().min(1)),
  values: z.array(z.number()).refine((v) => v.every(Number.isFinite), 'Chart values must be numbers'),
})

const checklistBlockSchema = z.object({
  type: z.literal('checklist'),
  title: z.string().min(1, 'Checklist title must be non-empty'),
  items: z.array(z.string().min(1)).min(1, 'Checklist needs at least one item'),
})

export const studyBlockSchema = z
  .discriminatedUnion('type', [cardBlockSchema, chartBlockSchema, checklistBlockSchema])
  .superRefine((block, ctx) => {
    if (block.type === 'chart') {
      if (block.labels.length < 2 || block.values.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chart needs at least 2 data points',
          path: ['labels'],
        })
      }
      if (block.labels.length !== block.values.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chart labels and values must have the same length',
          path: ['values'],
        })
      }
    }
  })

export const studyResponseSchema = z.object({
  title: z.string().min(1, 'Title must be non-empty'),
  summary: z.string().min(1, 'Summary must be non-empty'),
  blocks: z.array(studyBlockSchema).optional().default([]),
  flashcards: z.array(flashcardSchema).min(1, 'At least one flashcard required'),
  quiz: z.array(quizQuestionSchema).min(1, 'At least one quiz question required'),
})