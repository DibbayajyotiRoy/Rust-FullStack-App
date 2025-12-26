import type { Column } from "@/components/organisms/DataTable/DataTable"
import { AvatarBadge } from "@/components/ui/avatar-badge"
import { StatusPill } from "@/components/ui/status-pill"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, AlertCircle } from "lucide-react"

// Mock type until backend is ready
export interface AttendanceRecord {
    id: string
    date: string
    employee: {
        name: string
        avatar?: string
    }
    checkIn: string
    checkOut: string
    status: "Present" | "Late" | "Absent" | "Half-day"
    isOverride?: boolean
}

export const attendanceColumns: Column<AttendanceRecord>[] = [
    {
        header: "Date",
        cell: (row) => (
            <span className="text-muted-foreground whitespace-nowrap">
                {new Date(row.date).toLocaleDateString()}
            </span>
        ),
        className: "w-[120px]",
    },
    {
        header: "Employee",
        cell: (row) => (
            <AvatarBadge
                name={row.employee.name}
                src={row.employee.avatar}
            />
        ),
        className: "min-w-[200px]",
    },
    {
        header: "Check In",
        cell: (row) => (
            <span className="font-mono text-sm">{row.checkIn}</span>
        ),
        className: "min-w-[100px]",
    },
    {
        header: "Check Out",
        cell: (row) => (
            <span className="font-mono text-sm">{row.checkOut}</span>
        ),
        className: "min-w-[100px]",
    },
    {
        header: "Status",
        cell: (row) => {
            let variant: "success" | "warning" | "error" | "neutral" = "neutral"
            switch (row.status) {
                case "Present": variant = "success"; break;
                case "Late": variant = "warning"; break;
                case "Absent": variant = "error"; break;
                case "Half-day": variant = "warning"; break;
            }

            return (
                <div className="flex items-center gap-2">
                    <StatusPill variant={variant}>
                        {row.status}
                    </StatusPill>
                    {row.isOverride && (
                        <div title="Manual Override" className="text-amber-500">
                            <AlertCircle className="h-4 w-4" />
                        </div>
                    )}
                </div>
            )
        },
        className: "min-w-[140px]",
    },
    {
        header: (<span className="sr-only">Actions</span>),
        cell: () => (
            <div className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        ),
        className: "w-[50px]",
    },
]
