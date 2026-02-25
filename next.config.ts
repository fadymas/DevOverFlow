import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://172.18.160.1:3000',
    'https://dev-over-flow-kohl.vercel.app/'
  ],
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
