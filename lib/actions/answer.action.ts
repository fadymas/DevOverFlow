'use server'
import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import { CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from './shared.types'
import { Answer } from '@/database/answer.model'
import { revalidatePath } from 'next/cache'
import User from '@/database/user.model'
import Interaction from '@/database/interaction.model'
import UserProfile from '@/database/userProfile.model'
import { authActionClient } from '../safe-action'
import {
  CreateAnswerServerSchema,
  DeleteAnswerServerSchema,
  GetAnswersServerSchema,
  VoteAnswerServerSchema
} from '../validations'

export async function createAnswer(params: CreateAnswerParams) {
  const { userId } = await authActionClient()

  try {
    connectToDatabase()

    const parsed = CreateAnswerServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { author, question, content, path } = parsed.data

    const user = await UserProfile.findOne({ userId })
    const answer = await Answer.create({ author, question, content })
    // Ensure the authenticated user matches the author
    if (user._id.toString() !== author) {
      throw new Error('Unauthorized: You can only post answers as yourself.')
    }
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id }
    })

    await Interaction.create({
      user: author,
      action: 'answer',
      question,
      answer: answer._id,
      tags: questionObject.tags
    })

    await UserProfile.findByIdAndUpdate(author, { $inc: { reputation: 10 } })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function getAnswers(params: GetAnswersParams) {
  // Public read action — no auth required
  const parsed = GetAnswersServerSchema.safeParse(params)
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`)
  }

  try {
    connectToDatabase()

    const { questionId, sortBy } = parsed.data

    let sortOptions = {}
    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvotes: -1 }
        break
      case 'lowestUpvotes':
        sortOptions = { upvotes: 1 }
        break
      case 'recent':
        sortOptions = { createdAt: -1 }
        break
      case 'old':
        sortOptions = { createdAt: 1 }
        break
      default:
        break
    }

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: 'author',
        select: '_id ',
        populate: { path: 'userId', model: User, select: 'image name' }
      })
      .sort(sortOptions)

    return { answers }
  } catch (error) {
    console.log(error)
  }
}

export async function voteAnswer(params: {
  answerId: string
  userId: string
  type: 'upvote' | 'downvote'
  path: string
}) {
  const { userId: sessionUserId } = await authActionClient()

  try {
    await connectToDatabase()

    const parsed = VoteAnswerServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { answerId, userId, type, path } = parsed.data

    const user = await UserProfile.findOne({ userId: sessionUserId })
    if (user._id.toString() !== userId) {
      throw new Error('Unauthorized: You can only vote as yourself.')
    }
    const answer = await Answer.findById(answerId)
    if (!answer) throw new Error('Answer not found')

    const hasupVoted = answer.upvotes.includes(userId)
    const hasdownVoted = answer.downvotes.includes(userId)

    let updateQuery = {}
    let userReputationDelta = 0
    let authorReputationDelta = 0

    if (type === 'upvote') {
      if (hasupVoted) {
        updateQuery = { $pull: { upvotes: userId } }
        userReputationDelta = -5
        authorReputationDelta = -10
      } else {
        updateQuery = {
          $pull: { downvotes: userId },
          $addToSet: { upvotes: userId }
        }
        userReputationDelta = hasdownVoted ? 10 : 5
        authorReputationDelta = hasdownVoted ? 20 : 10
      }
    } else {
      if (hasdownVoted) {
        updateQuery = { $pull: { downvotes: userId } }
        userReputationDelta = 5
        authorReputationDelta = 10
      } else {
        updateQuery = {
          $pull: { upvotes: userId },
          $addToSet: { downvotes: userId }
        }
        userReputationDelta = hasupVoted ? -10 : -5
        authorReputationDelta = hasupVoted ? -20 : -10
      }
    }

    await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

    await UserProfile.findByIdAndUpdate(userId, { $inc: { reputation: userReputationDelta } })
    await UserProfile.findByIdAndUpdate(answer.author, {
      $inc: { reputation: authorReputationDelta }
    })

    revalidatePath(path)
  } catch (error) {
    console.error(error)
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase()

    const { userId: sessionUserId } = await authActionClient()

    const parsed = DeleteAnswerServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { answerId, path } = parsed.data
    const user = await UserProfile.findOne({ userId: sessionUserId })
    const answer = await Answer.findById(answerId)
    if (!answer) {
      throw new Error('Answer not found')
    }
    // Ensure the authenticated user is the author of the answer
    if (answer.author.toString() !== user._id.toString()) {
      throw new Error('Unauthorized: You can only delete your own answers.')
    }

    await Answer.deleteOne({ _id: answerId })
    await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId } })
    await Interaction.deleteMany({ answer: answerId })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}
