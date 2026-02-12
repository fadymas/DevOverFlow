import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const cookiesStore = await cookies()
  const { theme } = await request.json()

  cookiesStore.set('theme', theme)

  return NextResponse.json({ message: 'Theme changed successfully' })
}
