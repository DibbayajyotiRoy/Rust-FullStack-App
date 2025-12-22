import * as React from "react"
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useSettings } from "@/contexts/settings.context"
import { useTheme } from "@/contexts/theme.context"
import { AppSidebar } from "@/components/organisms/app-sidebar"
import { cn } from "@/lib/utils"

interface DynamicLayoutProps {
  children?: React.ReactNode
}

export function DynamicLayout({ children }: DynamicLayoutProps) {
  const { sidebarPosition } = useSettings()
  const { colors } = useTheme()

  return (
    <div 
      className="min-h-screen transition-all duration-300 ease-in-out"
      style={{ 
        backgroundColor: colors.background,
        color: colors.foreground 
      }}
    >
      <SidebarProvider style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
        <div className="flex min-h-screen w-full">
          {/* Left Sidebar */}
          {sidebarPosition === 'left' && <AppSidebar side="left" />}

          {/* Main Content */}
          <SidebarInset className="flex-1">
            <div className="flex flex-col h-full">
              {/* Header without toggle button */}
              <header 
                className="flex h-14 shrink-0 items-center gap-3 px-4 transition-colors relative z-10"
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.foreground 
                }}
              >
                <div className="flex items-center gap-2 text-sm overflow-hidden">
                  <span className="truncate">Employee Management</span>
                </div>
              </header>

              {/* Content Area */}
              <main className={cn(
                "flex-1 p-6 overflow-y-auto transition-all duration-300"
              )}>
                <div 
                  className="w-full min-h-[calc(100vh-5.5rem)] rounded-2xl shadow-xl transition-all duration-300 p-8 overflow-hidden"
                  style={{ 
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {children ?? <Outlet />}
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