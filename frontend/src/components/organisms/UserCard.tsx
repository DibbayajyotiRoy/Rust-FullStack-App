import { MoreHorizontal, Pencil, Mail, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types/user"
import { Badge } from "@/components/ui/badge"

interface UserCardProps {
    user: User
    onEdit: (user: User) => void
    onDelete: (id: string) => void
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
    return (
        <div className="group flex items-center h-[52px] px-4 gap-4 border-b border-border/30 hover:bg-accent transition-colors duration-200 cursor-default">
            {/* Name Column */}
            <div className="flex items-center gap-3 w-[240px] shrink-0">
                <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center text-primary/70 shrink-0">
                    <UserIcon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[14px] font-semibold tracking-tight truncate">{user.username}</span>
            </div>

            {/* Email Column */}
            <div className="flex items-center gap-2 w-[300px] shrink-0">
                <Mail className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                <span className="text-[12px] text-muted-foreground/70 truncate">{user.email}</span>
            </div>

            {/* Date Column */}
            <div className="w-[140px] shrink-0 text-[11px] font-mono text-muted-foreground/40 uppercase tracking-tighter">
                {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>

            {/* ID Column/Badge */}
            <div className="flex-1 flex items-center gap-4">
                <code className="text-[10px] font-mono text-muted-foreground/30 truncate max-w-[80px]">#{user.id.split('-')[0]}</code>
                <Badge variant="secondary" className="h-[20px] px-2 py-0 text-[10px] font-bold bg-muted/50 text-muted-foreground/60 border-none rounded">
                    MEMBER
                </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(user)}
                    className="h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 rounded-lg border-border/40 shadow-xl">
                        <DropdownMenuItem onClick={() => onEdit(user)} className="text-xs py-1.5 cursor-pointer">
                            Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(user.id)}
                            className="text-xs py-1.5 text-destructive focus:text-destructive cursor-pointer"
                        >
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
