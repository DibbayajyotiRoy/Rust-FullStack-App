import type { Column } from "@/components/organisms/DataTable/DataTable"
import { AvatarBadge } from "@/components/ui/avatar-badge"
import { StatusPill } from "@/components/ui/status-pill"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export interface LeaveRequest {
    id: string
    employee: { name: string; avatar?: string }
    leaveType: "Sick" | "Vacation" | "Personal" | "Maternity"
    startDate: string
    endDate: string
    duration: string
    status: "Pending" | "Approved" | "Rejected"
    approver?: string
}

export const leaveColumns: Column<LeaveRequest>[] = [
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
        header: "Leave Type",
        cell: (row) => (
            <span className="font-medium">{row.leaveType}</span>
        ),
        className: "min-w-[120px]",
    },
    {
        header: "Date Range",
        cell: (row) => (
            <div className="flex flex-col text-sm">
                <span className="text-muted-foreground">
                    {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
                </span>
            </div>
        ),
        className: "min-w-[180px]",
    },
    {
        header: "Duration",
        cell: (row) => (
            <span>{row.duration}</span>
        ),
        className: "w-[100px]",
    },
    {
        header: "Status",
        cell: (row) => {
            let variant: "success" | "warning" | "error" | "neutral" = "neutral"
            switch (row.status) {
                case "Approved": variant = "success"; break;
                case "Pending": variant = "warning"; break;
                case "Rejected": variant = "error"; break;
            }
            return <StatusPill variant={variant}>{row.status}</StatusPill>
        },
        className: "w-[120px]",
    },
    {
        header: "Approver",
        cell: (row) => (
            <span className="text-muted-foreground text-sm">{row.approver || "-"}</span>
        ),
        className: "min-w-[150px]",
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
