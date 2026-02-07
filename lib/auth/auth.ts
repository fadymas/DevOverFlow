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
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }: { user: Session; url: string }) => {
      fetch(process.env.BETTER_AUTH_URL + '/api/send-email', {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify({
          url,
          email: user.email
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          return
        })
        .catch((error) => console.log(error))
    }
  },
  socialProviders: {
    google: {
      accessType: 'offline',
      prompt: 'select_account consent',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createUser({ id: user.id })
        }
      }
    }
  },

  plugins: [nextCookies()]
})
