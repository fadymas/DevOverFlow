/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import { SearchParams } from './shared.types'
import { Answer } from '@/database/answer.model'
import Tag from '@/database/tag.model'
import UserProfile from '@/database/userProfile.model'

const searchableTypes = ['question', 'answer', 'user', 'tag']

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase()

    const { query, type } = params
    const regexQuery = { $regex: query, $options: 'i' }

    let results: any = []

    const modelsAndTypes = [
      { model: Question, searchField: 'title', type: 'question' },
      { model: UserProfile, searchField: 'name', type: 'user' },
      { model: Answer, searchField: 'content', type: 'answer' },
      { model: Tag, searchField: 'name', type: 'tag' }
    ]

    const typeLower = type?.toLowerCase()

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // search acroos everything
      for (const { model, searchField, type } of modelsAndTypes) {
        if (type === 'user') {
          const queryResults = await model.aggregate([
            {
              $lookup: {
                from: 'user',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' },
            {
              $match: {
                [`user.${searchField}`]: regexQuery
              }
            },
            { $limit: 8 }
          ])

          results.push(
            ...queryResults.map((item) => ({
              title: item.user.name,
              type: 'user',
              id: item.userId._id
            }))
          )
        } else {
          const queryResults = await model.find({ [searchField]: regexQuery }).limit(2)

          results.push(
            ...queryResults.map((item) => ({
              title: type === 'answer' ? `Answers containing ${query}` : item[searchField],
              type,
              id: type === 'answer' ? item.question : item._id
            }))
          )
        }
      }
    } else {
      //search in the specified model type
      const modelInfo = modelsAndTypes.find((item) => item.type === typeLower)

      if (!modelInfo) throw new Error('invalid search type')

      if (typeLower === 'user') {
        const queryResults = await modelInfo.model.aggregate([
          {
            $lookup: {
              from: 'user',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $match: {
              [`user.${modelInfo.searchField}`]: regexQuery
            }
          },
          { $limit: 8 }
        ])

        results.push(
          ...queryResults.map((item) => ({
            title: item.user.name,
            type: 'user',
            id: item.userId._id
          }))
        )
      } else {
        const queryResults = await modelInfo.model
          .find({ [modelInfo.searchField]: regexQuery })
          .limit(8)

        results = queryResults.map((item) => ({
          title: type === 'answer' ? `Answers containing ${query}` : item[modelInfo.searchField],
          type,
          id: type === 'answer' ? item.question : item._id
        }))
      }
    }

    return JSON.stringify(results)
  } catch (error) {
    console.log(error)
  }
}
