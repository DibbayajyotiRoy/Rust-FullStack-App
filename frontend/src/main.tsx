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
import RolesManagement from './pages/RolesManagement.tsx'
import PoliciesManagement from './pages/PoliciesManagement.tsx'

import LoginPage from './pages/LoginPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'

import { RoleGuard } from './components/RoleGuard.tsx'

// Providers
import { ThemeProvider } from './contexts/theme.context.tsx'
import { AuthProvider } from './contexts/auth.context.tsx'
import { SettingsProvider } from './contexts/settings.context.tsx'
import { Toaster } from "./components/ui/sonner.tsx"

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <RoleGuard><App /></RoleGuard>,
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
        element: <RoleGuard requiredLevel={0}><RolesManagement /></RoleGuard>
      },
      {
        path: 'policies',
        element: <RoleGuard requiredLevel={0}><PoliciesManagement /></RoleGuard>
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
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <RouterProvider router={router} />
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
    </AuthProvider>
  </StrictMode>,
)