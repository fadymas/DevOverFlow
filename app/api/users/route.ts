import { connectToDatabase } from '@/lib/mongoose'
import { GetAllUsersServerSchema } from '@/lib/validations'
import { QueryFilter } from 'mongoose'
import UserProfile from '@/database/userProfile.model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    connectToDatabase()
    const parsed = GetAllUsersServerSchema.safeParse({
      searchQuery: request.nextUrl.searchParams.get('searchQuery') || '',
      filter: request.nextUrl.searchParams.get('filter') || '',
      page: Number(request.nextUrl.searchParams.get('page')) || 1,
      pageSize: Number(request.nextUrl.searchParams.get('pageSize')) || 10
    })
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

    return NextResponse.json({ users, isNext })
  } catch (error) {
    console.log(error)
    throw error
  }
}
