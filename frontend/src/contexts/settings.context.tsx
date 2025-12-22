import React, { createContext, useContext, useState } from 'react'

export type SidebarPosition = 'left' | 'right'

interface SettingsContextType {
  sidebarPosition: SidebarPosition
  setSidebarPosition: (position: SidebarPosition) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [sidebarPosition, setSidebarPositionState] = useState<SidebarPosition>(() => {
    const saved = localStorage.getItem('sidebarPosition')
    return (saved as SidebarPosition) || 'left'
  })

  const setSidebarPosition = (position: SidebarPosition) => {
    setSidebarPositionState(position)
    localStorage.setItem('sidebarPosition', position)
  }

  return (
    <SettingsContext.Provider value={{ sidebarPosition, setSidebarPosition }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}