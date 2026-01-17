import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  Users,
  LayoutDashboard,
  Shield,
  Calendar,
  Settings,
  PanelLeftIcon,
  FileText,
  CalendarDays,
  FileBarChart,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "@/contexts/theme.context"
import { useAuth } from "@/contexts/auth.context"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Employees",
    icon: Users,
    href: "/users",
    requiredLevel: 0,
  },
  {
    title: "Attendance",
    icon: Calendar,
    href: "/attendance",
  },
  {
    title: "Leave",
    icon: CalendarDays,
    href: "/leave",
  },
  {
    title: "Documents",
    icon: FileText,
    href: "/documents",
  },
  {
    title: "Reports",
    icon: FileBarChart,
    href: "/reports",
  },
  {
    title: "Access Control",
    icon: Shield,
    href: "/access-control",
    requiredLevel: 0,
    items: [
      {
        title: "Policies",
        href: "/access-control/policies",
      },
      {
        title: "Simulator",
        href: "/access-control/simulator",
      },
      {
        title: "Email Templates",
        href: "/access-control/payslip-templates",
      },
      {
        title: "Roles",
        href: "/access-control/roles",
      },
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  side?: "left" | "right"
}

export function AppSidebar({ side = "left", ...props }: AppSidebarProps) {
  const { colors } = useTheme()
  const location = useLocation()
  const { state, toggleSidebar } = useSidebar()
  const { user } = useAuth()

  // Simplified logic for superadmin check (matches RoleGuard.tsx)
  const isSuperadmin = user?.role_id === '00000000-0000-0000-0000-000000000000'

  const filteredItems = NAV_ITEMS.map(item => {
    // Clone item to avoid mutation
    const newItem = { ...item }

    // Route swaps for Employees (non-superadmin)
    if (!isSuperadmin) {
      if (item.href === '/') newItem.href = '/employee/dashboard'
      if (item.href === '/leave') newItem.href = '/employee/leave-requests'
      if (item.href === '/reports') newItem.href = '/employee/reports'
      // Hide Admin-only items check
      if (item.requiredLevel === 0) return null
    } else {
      // Admin checks
      if (item.requiredLevel === 0 && !isSuperadmin) return null
    }

    return newItem
  }).filter(Boolean) as typeof NAV_ITEMS


  return (
    <Sidebar
      collapsible="icon"
      side={side}
      {...props}
      style={{ backgroundColor: colors.sidebar }}
    >
      <SidebarHeader className="px-3 py-3">
        {/* Logo/Toggle Container - Contra Style */}
        <div className="relative group/logo-toggle mb-2">
          {/* Logo - Always visible when expanded, shows as icon when collapsed */}
          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-300 ease-in-out",
              state === "collapsed"
                ? "justify-center"
                : "opacity-100"
            )}
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center font-bold shadow-sm transition-transform duration-200 group-hover/logo-toggle:scale-105"
              style={{
                backgroundColor: '#5865F2',
                color: '#FFFFFF'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            {state === "expanded" && (
              <div className="flex flex-col leading-none animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="font-semibold text-sm tracking-tight" style={{ color: colors.foreground }}>EMS</span>
                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.foreground, opacity: 0.6 }}>
                  Admin Panel
                </span>
              </div>
            )}
          </div>

          {/* Toggle Button - Appears on hover when collapsed */}
          {state === "collapsed" && (
            <button
              onClick={toggleSidebar}
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "opacity-0 group-hover/logo-toggle:opacity-100",
                "transition-opacity duration-200",
                "hover:bg-accent/50 rounded-lg"
              )}
            >
              <PanelLeftIcon className="h-5 w-5" style={{ color: colors.foreground }} />
            </button>
          )}

          {/* Toggle Button - Always visible when expanded */}
          {state === "expanded" && (
            <button
              onClick={toggleSidebar}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent/50 rounded-md transition-colors"
            >
              <PanelLeftIcon className="h-4 w-4" style={{ color: colors.foreground }} />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          {filteredItems.map((item) => (
            <React.Fragment key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={location.pathname === item.href || (item.items?.some(sub => location.pathname.startsWith(sub.href)))}
                  className={cn(
                    "transition-all duration-200 ease-in-out h-9",
                    (location.pathname === item.href || (item.items?.some(sub => location.pathname.startsWith(sub.href))))
                      ? "bg-sidebar-accent shadow-sm translate-x-1"
                      : "hover:translate-x-1 hover:bg-sidebar-accent/50"
                  )}
                >
                  <Link
                    to={item.href}
                    className="flex items-center gap-3"
                  >
                    <item.icon className={cn("h-4 w-4 transition-colors", (location.pathname === item.href || (item.items?.some(sub => location.pathname.startsWith(sub.href)))) ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("font-medium transition-colors", (location.pathname === item.href || (item.items?.some(sub => location.pathname.startsWith(sub.href)))) ? "text-foreground" : "text-muted-foreground")}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Nested Items */}
              {item.items && (state === "expanded" || location.pathname.startsWith(item.href)) && (
                <div className="ml-9 mt-1 mb-2 flex flex-col gap-1 border-l border-sidebar-border/50 pl-2">
                  {item.items.map(subItem => (
                    <Link
                      key={subItem.title}
                      to={subItem.href}
                      className={cn(
                        "text-xs font-medium py-1.5 px-2 rounded-md transition-all",
                        location.pathname === subItem.href
                          ? "bg-sidebar-accent text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}