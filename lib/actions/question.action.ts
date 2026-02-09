'use server'

import Question, { IQuestion } from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import Tag, { ITag } from '@/database/tag.model'
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams
} from './shared.types'
import UserProfile from '@/database/userProfile.model'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import { QueryFilter } from 'mongoose'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase()

    const { searchQuery, filter } = params

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
      .populate({ path: 'author', model: UserProfile, populate: { path: 'userId', model: User } })
      .sort(sortOptions)
    return { questions }
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
    revalidatePath(path)
  } catch (error) {}
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

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase()

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })

    if (!question) {
      throw new Error('question not found')
    }

    // increament authors' reputation
    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase()

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })

    if (!question) {
      throw new Error('question not found')
    }

    // increament authors' reputation
    revalidatePath(path)
  } catch (error) {
    console.log(error)
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
