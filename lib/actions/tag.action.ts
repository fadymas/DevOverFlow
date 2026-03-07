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
import {
  GetAllTagsServerSchema,
  GetQuestionsByTagIdServerSchema,
  GetTopInteractedTagsServerSchema
} from '../validations'

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase()
    const parsed = GetTopInteractedTagsServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    const { userId, limit = 3 } = parsed.data
    const user = await UserProfile.findById(userId)
    if (!user) throw new Error('user not found')

    const topTags = await Question.aggregate([
      { $match: { author: user._id } },
      { $unwind: '$tags' },
      {
        $lookup: {
          from: 'tag',
          localField: 'tags',
          foreignField: '_id',
          as: 'tag'
        }
      },
      { $unwind: '$tag' },
      {
        $group: {
          _id: '$tag._id',
          name: { $first: '$tag.name' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ])

    return topTags
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase()
    const parsed = GetAllTagsServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }
    const { searchQuery, filter } = parsed.data
    const query: QueryFilter<typeof Tag> = {}

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, 'i') }
        }
      ]
    }

    let sortOptions = {}
    switch (filter) {
      case 'popular':
        sortOptions = { questions: 1 }
        break
      case 'recent':
        sortOptions = { createdOn: -1 }
        break
      case 'name':
        sortOptions = { name: 1 }
        break
      case 'old':
        sortOptions = { createdOn: 1 }
        break
      default:
        break
    }

    const tags = await Tag.find(query).sort(sortOptions)
    return { tags }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase()
    const parsed = GetQuestionsByTagIdServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }
    const { tagId, searchQuery } = parsed.data

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
