import type { Metadata } from 'next'
import './globals.css'
import '../styles/prism.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import ThemeProvider from '@/context/ThemeProvider'
import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk'
})

export const metadata: Metadata = {
  title: {
    template: '%s | DevOverFlow',
    default: 'DevOverFlow'
  },
  description: 'A community-driven platform for asking and answering programming questions',
  icons: {
    icon: '/assets/images/site-logo.svg'
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value
  return (
    <html lang="en" className={theme}>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider cookieMode={theme}>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
