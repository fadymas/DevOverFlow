'use server'

import { headers } from 'next/headers'
import { auth } from '../auth/auth'

export async function signUpServer(name: string, email: string, password: string) {
  const result = await auth.api.signUpEmail({
    body: {
      name: name, // required
      email: email, // required
      password: password, // required
      callbackURL: '/'
    }
  })
  return result
}
export async function signInServer(name: string, email: string, password: string) {
  const result = await auth.api.signInEmail({
    body: {
      email: email, // required
      password: password, // required
      callbackURL: '/'
    },
    headers: await headers()
  })
  return result
}

export async function signOut() {
  const result = await auth.api.signOut({
    // This endpoint requires session cookies.
    headers: await headers()
  })
  return result
}
