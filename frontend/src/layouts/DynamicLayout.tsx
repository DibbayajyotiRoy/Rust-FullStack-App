import * as React from "react"
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useSettings } from "@/contexts/settings.context"
import { useTheme } from "@/contexts/theme.context"
import { AppSidebar } from "@/components/organisms/app-sidebar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
              <header
                className="flex h-14 shrink-0 items-center justify-between gap-3 px-6 transition-colors"
                style={{
                  backgroundColor: colors.background,
                  color: colors.foreground
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Mobile Sidebar Trigger */}
                  <SidebarTrigger className="md:hidden" />

                  <div className="flex items-center gap-2 text-sm overflow-hidden">
                    <span className="truncate">Employee Management</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                        <span className="sr-only">Notifications</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-[300px] overflow-y-auto">
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-xs">New employee added</span>
                            <span className="text-[10px] text-muted-foreground">Just now</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-xs">System maintenance scheduled</span>
                            <span className="text-[10px] text-muted-foreground">1 hour ago</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-xs">Birthday reminders</span>
                            <span className="text-[10px] text-muted-foreground">2 hours ago</span>
                          </div>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
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