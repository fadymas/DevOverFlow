import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['http://localhost:3000', 'http://172.18.160.1:3000'],
  experimental: {
    mdxRs: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ]
  },
  serverExternalPackages: ['mongoose'],
  
}

export default nextConfig
