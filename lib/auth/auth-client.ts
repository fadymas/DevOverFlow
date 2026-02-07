import { createAuthClient } from 'better-auth/react'
import { createUser } from '../actions/user.action'

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: 'http://localhost:3000'
})

export function useAuth() {
  const signUp = (data: { name: string; email: string; password: string }) => {
    return authClient.signUp.email({ ...data, callbackURL: '/' })
  }

  const signIn = (data: { email: string; password: string }) => {
    return authClient.signIn.email({ ...data, callbackURL: '/' })
  }

  const signOut = () => authClient.signOut()

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

export type Session = typeof authClient.$Infer.Session.user
