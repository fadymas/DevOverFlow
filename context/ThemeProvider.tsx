'use client'
import { useState, createContext, useContext } from 'react'

interface ThemeContextType {
  mode: string
  handleThemeChange: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
export default function ThemeProvider({
  children,
  cookieMode
}: {
  children: React.ReactNode
  cookieMode: string | undefined
}) {
  const [mode, setMode] = useState(cookieMode || 'light')
  function handleThemeChange() {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme:dark)').matches)
    ) {
      setMode('dark')
      document.documentElement.classList.add('dark')
      fetch('/api/theme', {
        method: 'POST',
        body: JSON.stringify({ theme: 'dark' })
      })
    } else {
      setMode('light')
      document.documentElement.classList.remove('dark')
      fetch('/api/theme', {
        method: 'POST',
        body: JSON.stringify({ theme: 'light' })
      })
    }
  }

  return (
    <ThemeContext.Provider value={{ mode, handleThemeChange }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
