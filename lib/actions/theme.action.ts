'use server'
import { cookies } from 'next/headers'

export async function cookieThemeChange(theme: string) {
  const cookiesStore = await cookies()

  cookiesStore.set('theme', theme)
}
