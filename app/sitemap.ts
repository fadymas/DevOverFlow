import { MetadataRoute } from 'next'
import { getQuestions } from '@/lib/actions/question.action'
import { getAllTags } from '@/lib/actions/tag.action'
import { getAllUsers } from '@/lib/actions/user.action'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // Generate sitemaps for the static main routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ]

  let dynamicQuestionRoutes: MetadataRoute.Sitemap = []
  let dynamicTagRoutes: MetadataRoute.Sitemap = []
  let dynamicUserRoutes: MetadataRoute.Sitemap = []

  try {
    const questionsResult = await getQuestions({
      searchQuery: '',
      filter: '',
      page: 1,
      pageSize: 100
    }) // fetching more for sitemap if applicable
    dynamicQuestionRoutes = questionsResult.questions.map((question) => ({
      url: `${baseUrl}/question/${question._id}`,
      lastModified: question.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    }))
  } catch {
    console.warn('Failed to fetch questions for sitemap')
  }

  try {
    const tagsResult = await getAllTags({ searchQuery: '', filter: '' })
    dynamicTagRoutes = tagsResult.tags.map((tag) => ({
      url: `${baseUrl}/tags/${tag._id}`,
      lastModified: tag.createdOn || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6
    }))
  } catch {
    console.warn('Failed to fetch tags for sitemap')
  }

  try {
    const usersResult = await getAllUsers({ searchQuery: '', filter: '', page: 1, pageSize: 100 })
    dynamicUserRoutes = usersResult.users.map((user) => ({
      url: `${baseUrl}/profile/${user.userId._id}`,
      lastModified: user.joinedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.5
    }))
  } catch {
    console.warn('Failed to fetch users for sitemap')
  }

  return [...staticRoutes, ...dynamicQuestionRoutes, ...dynamicTagRoutes, ...dynamicUserRoutes]
}
