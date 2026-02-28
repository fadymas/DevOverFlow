import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server'

const allowedDevOrigins = [
  'http://localhost:3000',
  'http://172.18.160.1:3000',
  'https://dev-over-flow-kohl.vercel.app',
  'localhost:3000',
  'dev-over-flow-kohl.vercel.app'
]

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, '10s'),
  ephemeralCache: new Map(),
  prefix: '@upstash/ratelimit',
  analytics: true
})

function applyCors(res: NextResponse, origin: string) {
  res.headers.set('Access-Control-Allow-Origin', origin)
  res.headers.set('Access-Control-Allow-Credentials', 'true')
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export default async function proxy(
  request: NextRequest,
  context: NextFetchEvent
): Promise<Response | undefined> {
  const { pathname } = request.nextUrl

  // Strip trailing slash for origin comparison
  const requestOrigin =
    request.headers.get('Origin')?.replace(/\/$/, '') ||
    request.headers.get('Host')?.replace(/\/$/, '')
  const isAllowedOrigin = requestOrigin && allowedDevOrigins.includes(requestOrigin)
  // Handle OPTIONS preflight for all routes
  if (
    request.method === 'OPTIONS' ||
    request.method === 'PUT' ||
    request.method === 'PATCH' ||
    request.method === 'DELETE'
  ) {
    const res = new NextResponse(null, { status: 405 })
    if (isAllowedOrigin) applyCors(res, requestOrigin)
    return res
  }

  // --- Static assets: CORS only, no rate limiting ---
  // Matches: _next/static, _next/image, public files with extensions (js, css, img, fonts...)
  const isStaticAsset =
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    /\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|otf|map|webp|avif)$/.test(pathname)

  if (isStaticAsset) {
    const res = NextResponse.next()
    if (isAllowedOrigin) applyCors(res, requestOrigin)
    return res
  }

  // --- API routes & Server Actions: CORS + Rate limiting ---
  const isApiOrAction = pathname.startsWith('/api') || request.headers.get('next-action') !== null // server actions send this header

  if (isApiOrAction) {
    const headerslist = await headers()
    const ip = headerslist.get('x-forwarded-for') ?? '127.0.0.1'

    const { success, pending, limit, remaining } = await ratelimit.limit(ip)
    context.waitUntil(pending)

    const res = success
      ? NextResponse.next()
      : NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })

    res.headers.set('X-RateLimit-Success', success.toString())
    res.headers.set('X-RateLimit-Limit', limit.toString())
    res.headers.set('X-RateLimit-Remaining', remaining.toString())

    if (isAllowedOrigin) applyCors(res, requestOrigin)
    return res
  }

  // --- All other pages (RSC excluded via matcher): CORS only ---
  const res = NextResponse.next()
  if (isAllowedOrigin) applyCors(res, requestOrigin)
  return res
}
