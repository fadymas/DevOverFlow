import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return NextResponse.next()
}

// THIS IS THE KEY PART:
export const config = {
  matcher: ['/']
}
