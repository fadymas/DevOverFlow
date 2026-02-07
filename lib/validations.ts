import { z } from 'zod'

const emailSchema = z.email()
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')

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

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3)
})

export const AnswerSchema = z.object({
  answer: z.string().min(100)
})
