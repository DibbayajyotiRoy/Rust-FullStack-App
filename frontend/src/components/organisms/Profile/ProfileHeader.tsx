import { AvatarBadge } from "@/components/ui/avatar-badge"
import { StatusPill } from "@/components/ui/status-pill"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import type { User } from "@/types/user"

interface ProfileHeaderProps {
    user: User & { role?: string; is_active?: boolean } // Extended type
    onEdit?: () => void
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between p-6 bg-card border rounded-lg shadow-sm">
            <div className="flex items-start gap-6">
                <AvatarBadge
                    name={user.username}
                    size="lg"
                    className="h-20 w-20 text-xl"
                />
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {user.username}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        {/* Role Placeholder */}
                        <span>{user.role || "Employee"}</span>
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span>{user.email}</span>
                    </div>
                    <div className="pt-2">
                        <StatusPill variant={user.is_active !== false ? "success" : "neutral"}>
                            {user.is_active !== false ? "Active" : "Inactive"}
                        </StatusPill>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Button>
            </div>
        </div>
    )
}
