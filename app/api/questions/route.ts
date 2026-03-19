import { NextRequest, NextResponse } from 'next/server'
import { GetQuestionsServerSchema } from '@/lib/validations'
import { connectToDatabase } from '@/lib/mongoose'
import Question from '@/database/question.model'
import Tag from '@/database/tag.model'
import UserProfile from '@/database/userProfile.model'
import User from '@/database/user.model'
import { QueryFilter } from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageParam = searchParams.get('page')
    const pageSizeParam = searchParams.get('pageSize')

    const params = {
      searchQuery: searchParams.get('searchQuery') || null,
      filter: searchParams.get('filter') || null,
      page: pageParam ? Number(pageParam) : 1,
      pageSize: pageSizeParam ? Number(pageSizeParam) : 10
    }
    console.log(params)

    const parsed = GetQuestionsServerSchema.safeParse(params)
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`)
    }

    connectToDatabase()

    const { searchQuery, filter, page = 1, pageSize = 20 } = parsed.data

    const skipAmount = (page - 1) * pageSize

    const query: QueryFilter<typeof Question> = {}
    if (searchQuery) {
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
      .populate({ path: 'tags', model: Tag })
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

    return NextResponse.json({ questions, isNext })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
