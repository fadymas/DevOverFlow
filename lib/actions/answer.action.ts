'use server'
import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import { CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from './shared.types'
import { Answer } from '@/database/answer.model'
import { revalidatePath } from 'next/cache'
import User from '@/database/user.model'
import Interaction from '@/database/interaction.model'
import UserProfile from '@/database/userProfile.model'

export async function createAnswer(params: CreateAnswerParams) {
  const { author, question, content, path } = params
  try {
    connectToDatabase()
    const answer = await Answer.create({ author, question, content })

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
  try {
    connectToDatabase()

    const { questionId, sortBy } = params

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
  try {
    await connectToDatabase()
    const { answerId, userId, type, path } = params

    // 1. Fetch the actual current state of the question
    const answer = await Answer.findById(answerId)
    if (!answer) throw new Error('Answer not found')

    const hasupVoted = answer.upvotes.includes(userId)
    const hasdownVoted = answer.downvotes.includes(userId)

    let updateQuery = {}
    let userReputationDelta = 0
    let authorReputationDelta = 0

    if (type === 'upvote') {
      if (hasupVoted) {
        // Toggle off
        updateQuery = { $pull: { upvotes: userId } }
        userReputationDelta = -5
        authorReputationDelta = -10
      } else {
        // Switch from downvote to upvote OR just add upvote
        updateQuery = {
          $pull: { downvotes: userId },
          $addToSet: { upvotes: userId }
        }
        userReputationDelta = hasdownVoted ? 10 : 5
        authorReputationDelta = hasdownVoted ? 20 : 10
      }
    } else {
      if (hasdownVoted) {
        // Toggle off
        updateQuery = { $pull: { downvotes: userId } }
        userReputationDelta = 5
        authorReputationDelta = 10
      } else {
        // Switch from upvote to downvote OR just add downvote
        updateQuery = {
          $pull: { upvotes: userId },
          $addToSet: { downvotes: userId }
        }
        userReputationDelta = hasupVoted ? -10 : -5
        authorReputationDelta = hasupVoted ? -20 : -10
      }
    }

    // 2. Perform the update
    await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

    // 3. Update User Reputation
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

    const { answerId, path } = params

    const answer = await Answer.findById(answerId)
    if (!answer) {
      throw new Error('answer not found')
    }

    await Answer.deleteOne({ _id: answerId })
    await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId } })
    await Interaction.deleteMany({ answer: answerId })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}
