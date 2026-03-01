// lib/safe-action.ts
'use server'
import { headers } from 'next/headers'
import { auth } from './auth/auth'

export async function authActionClient() {
  const session = await auth.api.getSession({
    headers: await headers()
  }) // Your auth logic (NextAuth, Clerk, etc.)

  if (!session?.user) {
    throw new Error('Session not found! Nice try, curl user.')
  }

  // Pass the session metadata down to the action
  return { userId: session.user.id }
}
