import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UserPage from './pages/UserPage.tsx'
import UserProfilePage from './pages/UserProfilePage.tsx'
import AttendancePage from './pages/AttendancePage.tsx'
import LeavePage from './pages/LeavePage.tsx'
import DocumentsPage from './pages/DocumentsPage.tsx'
import ReportsPage from './pages/ReportsPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'

import NotFoundPage from './pages/NotFoundPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'users',
        element: <UserPage />
      },
      {
        path: 'users/:id',
        element: <UserProfilePage />
      },
      {
        path: 'attendance',
        element: <AttendancePage />
      },
      {
        path: 'leave',
        element: <LeavePage />
      },
      {
        path: 'documents',
        element: <DocumentsPage />
      },
      {
        path: 'reports',
        element: <ReportsPage />
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
        element: <DashboardPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)