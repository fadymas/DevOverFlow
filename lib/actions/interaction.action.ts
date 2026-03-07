'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import { ViewQuestionParams } from './shared.types'
import Interaction from '@/database/interaction.model'
import { ViewQuestionServerSchema } from '../validations'
import { authActionClient } from '../safe-action'
import UserProfile from '@/database/userProfile.model'

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase()
    const { userId } = await authActionClient()
    const parsed = ViewQuestionServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { questionId } = parsed.data

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } })

    if (userId) {
      const user = await UserProfile.findOne({ userId })
      const existingInteraction = await Interaction.findOne({
        user: user._id,
        action: 'view',
        questionId: questionId
      })

      if (existingInteraction) return console.log('user has already viewed.')

      await Interaction.create({
        user: user._id,
        action: 'view',
        question: questionId
      })
    }
  } catch (error) {
    console.log(error)
  }
}
