import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; " +
      // Allow Vercel Speed Insights scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://cdn.tiny.cloud; " +
      "style-src 'self' 'unsafe-inline' https://cdn.tiny.cloud; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "object-src 'none'; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      // Allow the browser to send the speed data back to Vercel
      "connect-src 'self' https://vitals.vercel-insights.com https://cdn.tiny.cloud;"
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
]

const nextConfig: NextConfig = {
  reactCompiler: true,
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://172.18.160.1:3000',
    'https://dev-over-flow-kohl.vercel.app/'
  ],
  poweredByHeader: false,
  experimental: {
    mdxRs: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ]
  },
  serverExternalPackages: ['mongoose']
}

export default withBundleAnalyzer(nextConfig)
