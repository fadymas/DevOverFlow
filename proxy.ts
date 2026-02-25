import { NextResponse } from 'next/server'
import { getSession } from './lib/actions/auth-action'

export async function proxy() {
  return NextResponse.next()
}

// THIS IS THE KEY PART:
export const config = {
  matcher: ['/api/:path*']
}
