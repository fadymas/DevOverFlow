'use server'

import UserProfile from '@/database/userProfile.model'
import { connectToDatabase } from '../mongoose'
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams
} from './shared.types'
import Tag, { ITag } from '@/database/tag.model'
import { QueryFilter } from 'mongoose'
import Question from '@/database/question.model'
import User from '@/database/user.model'

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase()

    const { userId, limit = 3 } = params
    const user = await UserProfile.findById(userId)
    if (!user) throw new Error('user not found')

    const topTags = await Question.aggregate([
      // 1️⃣ هات أسئلة المستخدم
      { $match: { author: user._id } },

      // 2️⃣ فك Array التاجات
      { $unwind: '$tags' },

      // 3️⃣ اعمل join مع tags collection
      {
        $lookup: {
          from: 'tag',
          localField: 'tags',
          foreignField: '_id',
          as: 'tag'
        }
      },

      // 4️⃣ فك Array اللي جاية من lookup
      { $unwind: '$tag' },

      // 5️⃣ عدّ استخدام كل تاج
      {
        $group: {
          _id: '$tag._id',
          name: { $first: '$tag.name' },
          count: { $sum: 1 }
        }
      },

      // 6️⃣ رتّب من الأكبر للأصغر
      { $sort: { count: -1 } },

      // 7️⃣ هات أول 3 بس
      { $limit: limit }
    ])

    // Find interactions for the user and group by tags
    return topTags
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase()
    const { searchQuery } = params
    const query: QueryFilter<typeof Tag> = {}

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, 'i') }
        }
      ]
    }

    const tags = await Tag.find(query)
    console.log(tags)
    return { tags }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase()
    const { tagId, searchQuery } = params

    const tagFilter: QueryFilter<ITag> = { _id: tagId }
    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery ? { title: { $regex: searchQuery, $options: 'i' } } : {},
      options: {
        sort: { createdAt: -1 }
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

    if (!tag) {
      throw new Error('tag not found')
    }

    const questions = tag.questions

    return { tagTitle: tag.name, questions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase()
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 }
    ])
    return popularTags
  } catch (error) {
    console.log(error)
    throw error
  }
}
