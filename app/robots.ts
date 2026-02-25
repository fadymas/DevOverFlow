import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow search engines from indexing private or internal paths
      disallow: [
        '/profile/edit',
        '/question/edit/',
        '/collection',
        '/ask-question',
        '/api/' // typically you do not want to index your local APIs either
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
