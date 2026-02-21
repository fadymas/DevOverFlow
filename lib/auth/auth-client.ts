import { createAuthClient } from 'better-auth/react'
import { auth } from './auth'
import { redirect } from 'next/navigation'

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
})

export function useAuth() {
  const signUp = (data: { name: string; email: string; password: string }) => {
    return authClient.signUp.email({ ...data, callbackURL: '/' })
  }

  const signIn = (data: { email: string; password: string }) => {
    return authClient.signIn.email({ ...data, callbackURL: '/' })
  }

  const signOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/'
        }
      }
    })
  }

  return { signUp, signIn, signOut }
}

export function useSocialAuth() {
  const signInSocial = (provider: string) => {
    return authClient.signIn.social({
      provider: provider
    })
  }
  return { signInSocial }
}

export function useSession() {
  const { data: session } = authClient.useSession()
  if (session) {
    return { session: session }
  }
  return { session: null }
}

export type Session = typeof authClient.$Infer.Session.user
export type serverSession = typeof auth.$Infer.Session
