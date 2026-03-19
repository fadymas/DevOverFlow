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
  verification: {
    google: 'gDo-bQE_5gQoEWlpOsKdHaMRERDv7C4pK3XwHPKC3dk'
  },
  title: {
    template: '%s | DevOverFlow',
    default:
      'DevOverflow is a community-driven platform for asking and answering programming questions. Get help, share knowledge, and grow as a developer.'
  },
  description: 'A community-driven platform for asking and answering programming questions',
  icons: {
    icon: '/assets/images/site-logo.svg'
  },
  openGraph: {
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'DevOverflow'
      }
    ],
    siteName: 'DevOverFlow',
    url: process.env.NEXT_PUBLIC_SERVER_URL
  },

  twitter: {
    card: 'summary_large_image'
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
