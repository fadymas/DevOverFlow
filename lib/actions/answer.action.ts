'use server'
import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from './shared.types'
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

    return answer
  } catch (error) {
    console.log(error)
    throw error
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
    throw error
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } }
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId }
      }
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId }
      }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

    if (!answer) {
      throw new Error('question not found')
    }

    // increament authors' reputation
    await UserProfile.findByIdAndUpdate(userId, { $inc: { reputation: hasupVoted ? -2 : 2 } })

    await UserProfile.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 }
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } }
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId }
      }
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId }
      }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

    if (!answer) {
      throw new Error('question not found')
    }

    // increament authors' reputation
    await UserProfile.findByIdAndUpdate(userId, { $inc: { reputation: hasdownVoted ? -2 : 2 } })

    await UserProfile.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 }
    })
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
