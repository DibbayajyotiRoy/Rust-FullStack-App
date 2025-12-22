import * as React from "react"
import { Outlet } from "react-router-dom" // or children if not using router
import { AppSidebar } from "@/components/organisms/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset>
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 px-4 md:px-6 border-b bg-background">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium">
                  Employee Management
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children ?? <Outlet />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
