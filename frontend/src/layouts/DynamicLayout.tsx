import * as React from "react"
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useSettings } from "@/contexts/settings.context"
import { useTheme } from "@/contexts/theme.context"
import { AppSidebar } from "@/components/organisms/app-sidebar"

interface DynamicLayoutProps {
  children?: React.ReactNode
}

export function DynamicLayout({ children }: DynamicLayoutProps) {
  const { sidebarPosition } = useSettings()
  const { colors } = useTheme()

  return (
    <div 
      className="h-screen overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        backgroundColor: colors.background,
        color: colors.foreground 
      }}
    >
      <SidebarProvider style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
        <div className="flex h-screen w-full overflow-hidden">
          {/* Left Sidebar */}
          {sidebarPosition === 'left' && <AppSidebar side="left" />}

          {/* Main Content */}
          <SidebarInset className="flex-1 overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header with mobile trigger */}
              <header 
                className="flex h-14 shrink-0 items-center gap-3 px-6 transition-colors"
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
              >
                {/* Mobile Sidebar Trigger */}
                <SidebarTrigger className="md:hidden" />
                
                <div className="flex items-center gap-2 text-sm overflow-hidden">
                  <span className="truncate">Employee Management</span>
                </div>
              </header>

              {/* Content Area - Scrollable */}
              <main className="flex-1 p-4 sm:p-6 overflow-hidden">
                <div 
                  className="w-full h-full rounded-2xl shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  style={{ 
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {children ?? <Outlet />}
                  </div>
                </div>
              </main>
            </div>
          </SidebarInset>

          {/* Right Sidebar */}
          {sidebarPosition === 'right' && <AppSidebar side="right" />}
        </div>
      </SidebarProvider>
    </div>
  )
}