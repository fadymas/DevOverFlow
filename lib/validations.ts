import { z } from 'zod'

// ============================================================
// SHARED PRIMITIVES
// ============================================================

const emailSchema = z.email()
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId')

// ============================================================
// FRONTEND SCHEMAS  (used in React Hook Form / client forms)
// ============================================================

export const forgetPasswordSchema = z.object({
  email: emailSchema
})

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Too small: expected userName to have 4 or more characters' })
      .max(30)
  })
  .extend(signInSchema.shape)

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

/** Used in the Ask/Edit Question form */
export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3)
})

/** Used in the Answer form */
export const AnswerSchema = z.object({
  answer: z.string().min(100)
})

/** Used in the Edit Profile form */
export const EditUserSchema = z.object({
  name: z.string().min(3).max(30),
  portfolioWebsite: z.union([z.url(), z.literal('')]),
  location: z.union([z.string().min(4).max(30), z.literal('')]),
  bio: z.union([z.string().min(4).max(150), z.literal('')])
})

// ============================================================
// BACKEND SCHEMAS  (used inside server actions for validation)
// ============================================================

/** answer.action → createAnswer */
export const CreateAnswerServerSchema = z.object({
  author: objectIdSchema,
  question: objectIdSchema,
  content: z.string().min(100, 'Answer must be at least 100 characters'),
  path: z.string().min(1)
})

/** answer.action → getAnswers */
export const GetAnswersServerSchema = z.object({
  questionId: objectIdSchema,
  sortBy: z.enum(['highestUpvotes', 'lowestUpvotes', 'recent', 'old']).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional()
})

/** answer.action → voteAnswer */
export const VoteAnswerServerSchema = z.object({
  answerId: objectIdSchema,
  userId: objectIdSchema,
  type: z.enum(['upvote', 'downvote']),
  path: z.string().min(1)
})

/** answer.action → deleteAnswer */
export const DeleteAnswerServerSchema = z.object({
  answerId: objectIdSchema,
  path: z.string().min(1)
})

/** question.action → createQuestion */
export const CreateQuestionServerSchema = z.object({
  title: z.string().min(5).max(130),
  content: z.string().min(100, 'Question explanation must be at least 100 characters'),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
  author: objectIdSchema,
  path: z.string().min(1)
})

/** question.action → getQuestions */
export const GetQuestionsServerSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  searchQuery: z.string().optional().nullable(),
  filter: z.enum(['newest', 'frequent', 'unanswered']).optional().nullable()
})

/** question.action → getQuestionById */
export const GetQuestionByIdServerSchema = z.object({
  questionId: objectIdSchema
})

/** question.action → voteQuestion */
export const VoteQuestionServerSchema = z.object({
  questionId: objectIdSchema,
  userId: objectIdSchema,
  type: z.enum(['upvote', 'downvote']),
  path: z.string().min(1)
})

/** question.action → deleteQuestion */
export const DeleteQuestionServerSchema = z.object({
  questionId: objectIdSchema,
  path: z.string().min(1)
})

/** question.action → editQuestion */
export const EditQuestionServerSchema = z.object({
  questionId: objectIdSchema,
  title: z.string().min(5).max(130),
  content: z.string().min(100, 'Question explanation must be at least 100 characters'),
  path: z.string().min(1)
})

/** question.action → getRecommendedQuestions */
export const RecommendedQuestionsServerSchema = z.object({
  userId: z.string().min(1),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  searchQuery: z.string().optional()
})

/** user.action → toggleSaveQuestion */
export const ToggleSaveQuestionServerSchema = z.object({
  questionId: objectIdSchema,
  path: z.string().min(1)
})

/** user.action → getSavedQuestions */
export const GetSavedQuestionsServerSchema = z.object({
  userId: z.string().min(1),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  filter: z
    .enum(['oldest', 'most_recent', 'most_voted', 'most_viewed', 'most_answered'])
    .optional(),
  searchQuery: z.string().optional()
})

/** user.action → getUserById */
export const GetUserByIdServerSchema = z.object({
  userId: z.string().min(1).optional()
})

/** user.action → getAllUsers */
export const GetAllUsersServerSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  filter: z.enum(['new_users', 'old_users', 'top_contributor', '']).optional().default(''),
  searchQuery: z.string().optional().default('')
})

/** user.action → updateUser */
export const UpdateUserServerSchema = z.object({
  name: z.string().min(3).max(30).optional(),
  portfolioWebsite: z.union([z.url(), z.literal('')]).optional(),
  location: z.union([z.string().min(4).max(30), z.literal('')]).optional(),
  bio: z.union([z.string().min(4).max(150), z.literal('')]).optional(),
  path: z.string().min(1)
})

/** user.action → getUserStats */
export const GetUserStatsServerSchema = z.object({
  userId: z.string().min(1),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional()
})

/** tag.action → getTopInteractedTags */
export const GetTopInteractedTagsServerSchema = z.object({
  userId: objectIdSchema,
  limit: z.number().int().positive().optional()
})

/** tag.action → getAllTags */
export const GetAllTagsServerSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  filter: z.enum(['popular', 'recent', 'name', 'old']).optional(),
  searchQuery: z.string().optional()
})

/** tag.action → getQuestionsByTagId */
export const GetQuestionsByTagIdServerSchema = z.object({
  tagId: objectIdSchema,
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  searchQuery: z.string().optional()
})

/** general.action → globalSearch */
export const GlobalSearchServerSchema = z.object({
  query: z.string().min(1).nullable().optional(),
  type: z.enum(['question', 'answer', 'user', 'tag']).nullable().optional()
})

/** interaction.action → viewQuestion */
export const ViewQuestionServerSchema = z.object({
  questionId: objectIdSchema,
  userId: z.string().optional()
})
