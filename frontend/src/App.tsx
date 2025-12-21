import UserManagementPage from "./pages/UserPage"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <UserManagementPage />
      <Toaster position="top-right" richColors />
    </>
  )
}

export default App
