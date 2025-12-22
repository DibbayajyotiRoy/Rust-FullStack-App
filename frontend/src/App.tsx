import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/theme.context'
import { SettingsProvider } from '@/contexts/settings.context'
import { DynamicLayout } from '@/layouts/DynamicLayout'
import { Toaster } from "@/components/ui/sonner"

function AppContent() {
  return (
    <DynamicLayout>
      <Outlet />
    </DynamicLayout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppContent />
        <Toaster
          theme="system"
          position="bottom-right"
          offset="24px"
          toastOptions={{
            style: {
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-foreground)',
              fontSize: '13px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        />
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App
