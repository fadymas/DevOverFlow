import { NextResponse, NextRequest } from 'next/server'
import UserProfile from '@/database/userProfile.model'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/database/user.model'
import Question from '@/database/question.model'
import { Answer } from '@/database/answer.model'
import { BadgeCriteriaType } from '@/types'
import { assignBadges } from '@/lib/utils'
import { GetUserByIdServerSchema } from '@/lib/validations'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    connectToDatabase()
    const parsed = GetUserByIdServerSchema.safeParse({
      userId: id
    })
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

    return NextResponse.json({
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}
