'use server'
import { QueryFilter } from 'mongoose'
import UserProfile, { IUserProfile } from '@/database/userProfile.model'
import { connectToDatabase } from '../mongoose'
import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams
} from './shared.types'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import Tag from '@/database/tag.model'
import Question from '@/database/question.model'
import { Answer } from '@/database/answer.model'

export async function createUser(params: { id: string }) {
  try {
    connectToDatabase()
    const { id } = params
    const newUserProfile = UserProfile.create({ userId: id })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDatabase()
    const { userId } = params
    const user = await UserProfile.findOne({ userId: userId })
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase()
    const { searchQuery, filter } = params
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
    // const { page = 1, pageSize = 20, filter, searchQuery } = params
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
      { $sort: sortOptions }
    ])

    return { users }
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
  } catch (error) {}
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
      model: User
    })

    if (!user) {
      throw new Error('user not found')
    }

    const totalQuestions = await Question.countDocuments({ author: user._id })
    const totalAnswers = await Answer.countDocuments({ author: user._id })

    return { user, totalQuestions, totalAnswers }
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
