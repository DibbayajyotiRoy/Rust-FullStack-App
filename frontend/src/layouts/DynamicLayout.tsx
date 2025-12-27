import * as React from "react"
import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useSettings } from "@/contexts/settings.context"
import { useTheme } from "@/contexts/theme.context"
import { AppSidebar } from "@/components/organisms/app-sidebar"
import { Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/use-notifications"
import { formatRelativeTime } from "@/lib/date-utils"

interface DynamicLayoutProps {
  children?: React.ReactNode
}

export function DynamicLayout({ children }: DynamicLayoutProps) {
  const { sidebarPosition } = useSettings()
  const { colors } = useTheme()
  const { notifications, unreadCount, isConnected, error, markAsRead, markAllAsRead } = useNotifications()

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
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                        <span className="sr-only">Notifications</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>Notifications</span>
                          {!isConnected && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Connecting...
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <Button
                            variant="ghost"
                            className="h-auto p-0 text-[10px] hover:bg-transparent underline underline-offset-2"
                            onClick={(e) => {
                              e.preventDefault()
                              markAllAsRead()
                            }}
                          >
                            Mark all as read
                          </Button>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-[300px] overflow-y-auto">
                        {error && (
                          <div className="px-2 py-4 text-center text-xs text-red-500">
                            {error}
                          </div>
                        )}
                        {!error && notifications.length === 0 && (
                          <div className="px-2 py-8 text-center text-xs text-muted-foreground">
                            No notifications yet
                          </div>
                        )}
                        {!error && notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className="cursor-pointer relative pr-8"
                            onClick={() => {
                              if (!notification.is_read) {
                                markAsRead(notification.id)
                              }
                            }}
                          >
                            <div className="flex flex-col gap-1 w-full">
                              <span className={`text-xs ${notification.is_read ? 'text-muted-foreground' : 'font-semibold'}`}>
                                {notification.message}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {formatRelativeTime(notification.created_at)}
                              </span>
                            </div>
                            {!notification.is_read && (
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-600" />
                            )}
                          </DropdownMenuItem>
                        ))}
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