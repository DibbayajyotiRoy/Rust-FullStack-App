import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserPage from './pages/UserPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'dashboard',
        element: <div>Dashboard Coming Soon</div>
      },
      {
        path: 'users',
        element: <UserPage />
      },
      {
        path: 'attendance',
        element: <div>Attendance Coming Soon</div>
      },
      {
        path: 'roles',
        element: <div>Roles & Access Coming Soon</div>
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        index: true,
        element: <UserPage />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
