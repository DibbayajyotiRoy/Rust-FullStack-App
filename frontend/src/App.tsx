import UserManagementPage from "./pages/UserPage"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <UserManagementPage />
      <Toaster
        theme="system"
        position="bottom-right"
        offset="24px"
        toastOptions={{
          style: {
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--foreground)',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        }}
      />
    </>
  )
}

export default App
