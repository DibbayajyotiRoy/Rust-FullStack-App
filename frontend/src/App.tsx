import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/theme.context'
import { SettingsProvider } from '@/contexts/settings.context'
import { DynamicLayout } from '@/layouts/DynamicLayout'
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react"
import { toast } from "sonner"
import { Wifi, WifiOff } from "lucide-react"

function AppContent() {
  return (
    <DynamicLayout>
      <Outlet />
    </DynamicLayout>
  )
}

function App() {
  useEffect(() => {
    const handleOnline = () => {
      toast.success("Back online!", {
        icon: <Wifi className="h-4 w-4" />,
        description: "You have reconnected to the internet.",
      })
    }

    const handleOffline = () => {
      toast.error("You are currently offline", {
        icon: <WifiOff className="h-4 w-4" />,
        description: "Check your internet connection.",
        duration: Infinity,
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

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
