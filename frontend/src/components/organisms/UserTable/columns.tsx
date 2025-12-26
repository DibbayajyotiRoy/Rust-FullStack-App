import type { Column } from "@/components/organisms/DataTable/DataTable"
import type { User } from "@/types/user"
import { AvatarBadge } from "@/components/ui/avatar-badge"
import { StatusPill } from "@/components/ui/status-pill"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

// Extended type for UI purposes until backend is updated
type ExtendedUser = User & {
    role?: string;
    is_active?: boolean;
}

export const userColumns: Column<ExtendedUser>[] = [
    {
        header: (
            <div className="w-[30px]">
                <Checkbox />
            </div>
        ),
        cell: () => (
            <div className="w-[30px]">
                <Checkbox />
            </div>
        ),
        className: "w-[50px] px-4",
    },
    {
        header: "Employee",
        cell: (user) => (
            <AvatarBadge
                name={user.username || "Unknown"}
            // src={user.avatarUrl} // Add if available
            />
        ),
        className: "min-w-[200px]",
    },
    {
        header: "Role",
        cell: (user) => (
            <div className="flex flex-col">
                <span className="font-medium">{user.role || "Employee"}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
        ),
        className: "min-w-[150px]",
    },
    {
        header: "Status",
        cell: (user) => (
            <StatusPill variant={user.is_active !== false ? "success" : "neutral"}>
                {user.is_active !== false ? "Active" : "Inactive"}
            </StatusPill>
        ),
        className: "min-w-[100px]",
    },
    {
        header: "Date Joined",
        cell: (user) => (
            <span className="text-muted-foreground whitespace-nowrap type-secondary">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
            </span>
        ),
        className: "min-w-[120px]",
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
