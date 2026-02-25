import { NextResponse } from 'next/server'
export async function proxy() {
  return NextResponse.next()
}

// THIS IS THE KEY PART:
export const config = {
  matcher: ['/api/:path*']
}
