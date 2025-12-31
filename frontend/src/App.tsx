import { Outlet } from 'react-router-dom'
import { DynamicLayout } from '@/layouts/DynamicLayout'

function App() {
  return (
    <DynamicLayout>
      <Outlet />
    </DynamicLayout>
  )
}

export default App
