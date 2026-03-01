import { betterAuth } from 'better-auth'
import { adapter } from './adapter'
import { nextCookies } from 'better-auth/next-js'
import { Session } from './auth-client'
import { createUser } from '../actions/user.action'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: adapter,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }: { user: Session; url: string }) => {
      fetch(process.env.BETTER_AUTH_URL + '/api/send-email', {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify({
          url,
          email: user.email,
          subject: 'Reset your password',
          html: `<h1>Click the link to reset your password: <a href=${url}>here</a></h1>`
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }: { user: Session; url: string }) => {
      fetch(process.env.BETTER_AUTH_URL + '/api/send-email', {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify({
          email: user.email,
          subject: 'Verify Your Email',
          html: `<h1>Verify Your Email <a href=${url}>here</a></h1>`
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    async afterEmailVerification(user) {
      await createUser({ id: user.id })
    },
    autoSignInAfterVerification: true
  },
  socialProviders: {
    google: {
      accessType: 'offline',
      prompt: 'select_account consent',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      overrideUserInfoOnSignIn: true,
      mapProfileToUser: async (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture
        }
      }
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      overrideUserInfoOnSignIn: true,
      mapProfileToUser: async (profile) => {
        return {
          name: profile.name || profile.login, // GitHub sometimes has null names, so we use login as fallback
          email: profile.email,
          image: profile.avatar_url
        }
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.emailVerified) {
            await createUser({ id: user.id })
          }
        }
      }
    }
  },

  plugins: [nextCookies()]
})
