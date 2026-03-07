'use server'
import { QueryFilter } from 'mongoose'
import UserProfile from '@/database/userProfile.model'
import { connectToDatabase } from '../mongoose'
import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams
} from './shared.types'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import Tag from '@/database/tag.model'
import Question from '@/database/question.model'
import { Answer } from '@/database/answer.model'
import { BadgeCriteriaType } from '@/types'
import { assignBadges } from '../utils'
import { authActionClient } from '../safe-action'
import {
  GetAllUsersServerSchema,
  GetSavedQuestionsServerSchema,
  GetUserByIdServerSchema,
  GetUserStatsServerSchema,
  ToggleSaveQuestionServerSchema,
  UpdateUserServerSchema
} from '../validations'

export async function createUser(params: { id: string }) {
  try {
    connectToDatabase()
    const { id } = params
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Validation failed: user id is required')
    }
    await UserProfile.create({ userId: id })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase()
    const parsed = GetUserByIdServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }
    const { userId } = parsed.data
    const user = await UserProfile.findOne({ userId: userId }).populate({
      path: 'userId',
      model: User,
      select: '_id name image'
    })
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase()
    const parsed = GetAllUsersServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }
    const { searchQuery, filter, page = 1, pageSize = 10 } = parsed.data

    const skipAmount = (page - 1) * pageSize

    const query: QueryFilter<typeof UserProfile> = {}

    if (searchQuery) {
      query.$or = [
        { 'userId.name': { $regex: new RegExp(searchQuery, 'i') } },
        { 'userId.email': { $regex: new RegExp(searchQuery, 'i') } }
      ]
    }

    let sortOptions = {}

    switch (filter) {
      case 'new_users':
        sortOptions = { joinedAt: -1 }
        break
      case 'old_users':
        sortOptions = { joinedAt: 1 }
        break
      case 'top_contributor':
        sortOptions = { reputation: -1 }
        break
      default:
        sortOptions = { joinedAt: -1 }
        break
    }

    const users = await UserProfile.aggregate([
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId'
        }
      },
      { $unwind: '$userId' },
      { $match: query },
      { $skip: skipAmount },
      { $limit: pageSize },
      { $sort: sortOptions }
    ])
    const totalUsers = await UserProfile.countDocuments(query)

    const isNext = totalUsers > skipAmount + users.length

    return { users, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase()
    const parsed = ToggleSaveQuestionServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }
    const { questionId, path } = parsed.data
    const { userId } = await authActionClient()

    const user = await UserProfile.findOne({ userId })

    if (!user) {
      throw new Error('user not found')
    }

    const isQuestionSaved = user.saved.includes(questionId)

    if (isQuestionSaved) {
      await UserProfile.findOneAndUpdate(
        { userId },
        { $pull: { saved: questionId } },
        { new: true }
      )
    } else {
      await UserProfile.findOneAndUpdate(
        { userId },
        { $addToSet: { saved: questionId } },
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase()
    const parsed = GetSavedQuestionsServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { userId, filter, searchQuery, page = 1, pageSize = 20 } = parsed.data

    const query: QueryFilter<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {}

    let sortOptions = {}

    const skipAmount = (page - 1) * pageSize

    switch (filter) {
      case 'oldest':
        sortOptions = { createdAt: 1 }
        break
      case 'most_recent':
        sortOptions = { createdAt: -1 }
        break
      case 'most_voted':
        sortOptions = { upvotes: -1 }
        break
      case 'most_viewed':
        sortOptions = { views: -1 }
        break
      case 'most_answered':
        sortOptions = { answers: -1 }
        break
      default:
        sortOptions = { createdAt: -1 }
        break
    }

    const user = await UserProfile.findOne({ userId: userId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        {
          path: 'author',
          model: UserProfile,
          select: '_id',
          populate: { path: 'userId', model: User, select: 'name image' }
        }
      ]
    })

    if (!user) {
      throw new Error('user not found')
    }

    const savedQuestions = user.saved

    return { questions: savedQuestions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase()
    const parsed = GetUserByIdServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }
    const { userId } = parsed.data

    const user = await UserProfile.findOne({ userId: userId }).populate({
      path: 'userId',
      model: User,
      select: 'name image id'
    })

    if (!user) {
      throw new Error('user not found')
    }

    const totalQuestions = await Question.countDocuments({ author: user._id })
    const totalAnswers = await Answer.countDocuments({ author: user._id })

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: '$upvotes' } } },
      { $group: { _id: null, totalUpvotes: { $sum: '$upvotes' } } }
    ])
    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: '$upvotes' } } },
      { $group: { _id: null, totalUpvotes: { $sum: '$upvotes' } } }
    ])
    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ])

    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
      { type: 'QUESTION_UPVOTES' as BadgeCriteriaType, count: questionUpvotes?.totalUpvotes || 0 },
      { type: 'ANSWER_UPVOTES' as BadgeCriteriaType, count: answerUpvotes?.totalUpvotes || 0 },
      { type: 'TOTAL_VIEWS' as BadgeCriteriaType, count: questionViews?.totalViews || 0 }
    ]

    const badgeCounts = assignBadges({ criteria })

    return { user, totalQuestions, totalAnswers, badgeCounts, reputation: user.reputation }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUsersQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase()
    const parsed = GetUserStatsServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { userId } = parsed.data

    const totalQuestions = await Question.countDocuments({ author: userId })

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate('tags', '_id name')
      .populate({
        path: 'author',
        model: UserProfile,
        populate: { path: 'userId', model: User, select: ' name image' }
      })

    return { totalQuestions, questions: userQuestions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase()
    const parsed = GetUserStatsServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { userId } = parsed.data

    const totalAnswers = await Answer.countDocuments({ author: userId })

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate('question', '_id title')
      .populate({
        path: 'author',
        model: UserProfile,
        populate: { path: 'userId', model: User, select: ' name image' }
      })

    return { totalAnswers, answers: userAnswers }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase()
    const parsed = UpdateUserServerSchema.safeParse({ ...params.updateData, path: params.path })
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { path, bio, location, portfolioWebsite, name } = parsed.data
    const { userId } = await authActionClient()

    await User.findOneAndUpdate({ _id: userId }, { name }, { new: true })

    await UserProfile.findOneAndUpdate(
      { userId: userId },
      { bio, location, portfolioWebsite },
      { new: true }
    )

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}
