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

export async function createUser(params: { id: string }) {
  try {
    connectToDatabase()
    const { id } = params
    await UserProfile.create({ userId: id })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase()
    const { userId } = params
    const user = await UserProfile.findOne({ userId: userId }).populate({
      path: 'userId',
      model: User,
      select: ' name image'
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
    const { searchQuery, filter, page = 1, pageSize = 1 } = params

    //calculate the number of posts to skip based on the page number and size
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
      {
        $match: query
      },
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
    const { userId, questionId, path } = params

    const user = await UserProfile.findById(userId)

    if (!user) {
      throw new Error('user not found')
    }

    const isQuestionSaved = user.saved.includes(questionId)

    if (isQuestionSaved) {
      //remove question from saved
      await UserProfile.findByIdAndUpdate(userId, { $pull: { saved: questionId } }, { new: true })
    } else {
      await UserProfile.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase()

    const { userId, filter, searchQuery } = params

    const query: QueryFilter<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {}

    let sortOptions = {}

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
        sort: sortOptions
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
    const { userId } = params

    const user = await UserProfile.findOne({ userId: userId }).populate({
      path: 'userId',
      model: User,
      select: 'name image'
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

    const { userId } = params

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

    const { userId } = params

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

    const { authId, updateData, path } = params
    const { bio, location, portfolioWebsite, name } = updateData

    await User.findOneAndUpdate({ authId }, { name }, { new: true })

    await UserProfile.findOneAndUpdate(
      { userId: authId },
      { bio, location, portfolioWebsite },
      { new: true }
    )

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
