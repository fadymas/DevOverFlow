import { createAuthClient } from 'better-auth/react'
import { auth } from './auth'

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

  const forgetPassword = (data: { email: string }) => {
    return authClient.requestPasswordReset(
      {
        email: data.email,
        redirectTo: '/reset-password'
      },
      {
        onSuccess: () => {
          if (window.location.href.includes('/check-email')) return
          window.location.href = `/check-email?email=${data.email}`
        }
      }
    )
  }

  const resetPassword = (data: { password: string }) => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) {
      throw new Error('No token found')
    }
    return authClient.resetPassword(
      {
        newPassword: data.password,
        token: token
      },
      {
        onSuccess: () => {
          window.location.href = '/sign-in'
        },
        onError(context) {
          console.log(context.error)
        }
      }
    )
  }
  return { signUp, signIn, signOut, forgetPassword, resetPassword }
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
