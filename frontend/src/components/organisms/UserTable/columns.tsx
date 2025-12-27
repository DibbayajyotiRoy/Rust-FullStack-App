import type { Column } from "@/components/organisms/DataTable/DataTable"
import type { User } from "@/types/user"
import { AvatarBadge } from "@/components/ui/avatar-badge"
import { StatusPill } from "@/components/ui/status-pill"
import { Checkbox } from "@/components/ui/checkbox"

// Extended type for UI purposes until backend is updated
type ExtendedUser = User & {
    role?: string;
    is_active?: boolean;
}

interface UserColumnParams {
    selectedIds: Set<string>;
    onSelectRow: (id: string, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    isAllSelected: boolean;
}

export const getUserColumns = ({
    selectedIds,
    onSelectRow,
    onSelectAll,
    isAllSelected
}: UserColumnParams): Column<ExtendedUser>[] => [
        {
            header: (
                <div className="flex items-center justify-center w-[30px]" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={(checked) => onSelectAll(!!checked)}
                    />
                </div>
            ),
            cell: (user) => (
                <div className="flex items-center justify-center w-[30px]" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={selectedIds.has(user.id)}
                        onCheckedChange={(checked) => onSelectRow(user.id, !!checked)}
                    />
                </div>
            ),
            className: "w-[50px] px-4",
        },
        {
            header: "Employee",
            cell: (user) => (
                <AvatarBadge
                    name={user.username || "Unknown"}
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
    ]
