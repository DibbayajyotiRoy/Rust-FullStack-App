import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'custard' | 'midnight'

export interface ThemeColors {
  background: string
  card: string
  sidebar: string
  foreground: string
  muted: string
  accent: string
  border: string
  input: string
  ring: string
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#FCFCF5',
    card: '#FFFFFF',
    sidebar: '#FCFCF5',
    foreground: '#1A1A1A',
    muted: '#F2F2E9',
    accent: '#F4F4F5',
    border: '#E2E2D1',
    input: '#E2E2D1',
    ring: '#5865F2',
  },
  dark: {
    background: '#0a0a0a',
    card: '#18181b',
    sidebar: '#0a0a0a',
    foreground: '#F2F3F5',
    muted: '#2B2D31',
    accent: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.08)',
    input: 'rgba(255, 255, 255, 0.05)',
    ring: '#5865F2',
  },
  custard: {
    background: '#F5F5E8',
    card: '#FFFFF8',
    sidebar: '#F5F5E8',
    foreground: '#1A1A1A',
    muted: '#F2F2E9',
    accent: '#F4F4F5',
    border: '#E2E2D1',
    input: '#E2E2D1',
    ring: '#5865F2',
  },
  midnight: {
    background: '#09090b',
    card: '#1a1a1a',
    sidebar: '#09090b',
    foreground: '#F2F3F5',
    muted: '#2B2D31',
    accent: 'rgba(255, 255, 255, 0.04)',
    border: 'rgba(255, 255, 255, 0.08)',
    input: 'rgba(255, 255, 255, 0.05)',
    ring: '#5865F2',
  },
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  colors: ThemeColors
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as Theme) || 'custard'
  })

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    const colors = themes[theme]
    const root = document.documentElement
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    // Update body class for legacy dark mode support
    if (theme === 'dark' || theme === 'midnight') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [theme])

  const colors = themes[theme]

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}