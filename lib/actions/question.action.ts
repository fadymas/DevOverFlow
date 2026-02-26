/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import Question from '@/database/question.model'
import User from '@/database/user.model'
import Interaction from '@/database/interaction.model'
import { Answer } from '@/database/answer.model'
import { connectToDatabase } from '../mongoose'
import Tag, { ITag } from '@/database/tag.model'
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  RecommendedParams
} from './shared.types'
import UserProfile from '@/database/userProfile.model'
import { revalidatePath } from 'next/cache'
import { QueryFilter } from 'mongoose'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase()

    const { searchQuery, filter, page = 1, pageSize = 20 } = params

    //calculate the number of posts to skip based on the page number and size
    const skipAmount = (page - 1) * pageSize

    const query: QueryFilter<typeof Question> = {}
    if (searchQuery) {
      // get one of two conditions
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } }
      ]
    }

    let sortOptions = {}
    switch (filter) {
      case 'newest':
        sortOptions = { createdAt: -1 }
        break
      case 'frequent':
        sortOptions = { views: -1 }
        break
      case 'unanswered':
        query.answers = { $size: 0 }
        break
      default:
        break
    }

    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag }) // ask ai
      .populate({
        path: 'author',
        model: UserProfile,
        populate: { path: 'userId', model: User, select: '_id name image' }
      })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)

    const totalQuestions = await Question.countDocuments(query)

    const isNext = totalQuestions > skipAmount + questions.length
    return { questions, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase()

    const { title, content, tags, author, path } = params

    const question = await Question.create({ title, content, author })

    const tagDocuments = []
    // find the tag or create it
    for (const tag of tags) {
      const existingTag: ITag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      )
      tagDocuments.push(existingTag._id)
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } }
    })

    await Interaction.create({
      user: author,
      action: 'ask_question',
      question: question._id,
      tags: tagDocuments
    })

    await UserProfile.findByIdAndUpdate(author, { $inc: { reputation: 5 } })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase()
    const { questionId } = params
    const question = await Question.findById(questionId)
      .populate({
        path: 'tags',
        model: Tag,
        select: '_id name'
      })
      .populate({
        path: 'author',
        model: UserProfile,
        populate: { path: 'userId', model: 'User', select: ' _id name image' }
      })

    return question
  } catch (error) {
    console.log(error)
    throw error
  }
}
export async function voteQuestion(params: {
  questionId: string
  userId: string
  type: 'upvote' | 'downvote'
  path: string
}) {
  try {
    await connectToDatabase()
    const { questionId, userId, type, path } = params

    // 1. Fetch the actual current state of the question
    const question = await Question.findById(questionId)
    if (!question) throw new Error('Question not found')

    const hasupVoted = question.upvotes.includes(userId)
    const hasdownVoted = question.downvotes.includes(userId)

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
        userReputationDelta = hasdownVoted ? 10 : 5 // Reverse downvote (-5) and add upvote (+5) OR just add (+5)
        authorReputationDelta = hasdownVoted ? 20 : 10 // Reverse downvote (-10) and add upvote (+10) OR just add (+10)
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
        userReputationDelta = hasupVoted ? -10 : -5 // Reverse upvote (+5) and add downvote (-5) OR just add (-5)
        authorReputationDelta = hasupVoted ? -20 : -10 // Reverse upvote (+10) and add downvote (-10) OR just add (-10)
      }
    }

    // 2. Perform the update
    await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })

    // 3. Update User Reputation
    await UserProfile.findByIdAndUpdate(userId, { $inc: { reputation: userReputationDelta } })
    await UserProfile.findByIdAndUpdate(question.author, {
      $inc: { reputation: authorReputationDelta }
    })

    revalidatePath(path)
  } catch (error) {
    console.error(error)
    throw error
  }
}
export async function getHotQuestions() {
  try {
    connectToDatabase()
    const hotQuestions = await Question.find({}).sort({ views: -1, upvotes: -1 })

    return hotQuestions
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase()

    const { userId, page = 1, pageSize = 20, searchQuery } = params

    const userProfile = await UserProfile.findOne({ userId })

    if (!userProfile) throw new Error('User not found')

    const skipAmount = (page - 1) * pageSize

    const userInteractions = await Interaction.find({ user: userProfile._id })
      .populate('tags')
      .exec()

    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags)
      }
      return tags
    }, [])

    console.log(userTags)

    const distinctUserTagIds = [...new Set(userTags.map((tag: any) => tag._id))]

    const query: QueryFilter<typeof Question> = {
      $and: [
        {
          tags: { $in: distinctUserTagIds }
        },
        {
          author: { $ne: userProfile._id }
        }
      ]
    }

    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: searchQuery, $options: 'i' }
        },
        {
          content: { $regex: searchQuery, $options: 'i' }
        }
      ]
    }

    const totalQuestions = await Question.countDocuments(query)

    const recommendedQuestions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: UserProfile })
      .skip(skipAmount)
      .limit(pageSize)

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length

    return { questions: recommendedQuestions, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase()

    const { questionId, path } = params

    await Question.deleteOne({ _id: questionId })
    await Answer.deleteMany({ question: questionId })
    await Interaction.deleteMany({ question: questionId })
    await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase()

    const { questionId, title, content, path } = params

    const question = await Question.findById(questionId).populate('tags')

    if (!question) {
      throw new Error('question not found')
    }

    question.title = title
    question.content = content
    await question.save()

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
