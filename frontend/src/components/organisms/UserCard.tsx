import { MoreHorizontal, Pencil, Trash2, Mail, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types/user"

interface UserCardProps {
    user: User
    onEdit: (user: User) => void
    onDelete: (id: string) => void
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
    return (
        <div className="group grid grid-cols-[1fr_auto] sm:grid-cols-[200px_1fr_140px_100px_48px] items-start min-h-[52px] pt-3.5 pb-2 px-4 border-b border-border/30 hover:bg-accent/40 transition-colors duration-200 cursor-default gap-x-4">
            {/* Name & Email Column */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center text-primary/70 shrink-0">
                        <UserIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[14px] font-semibold tracking-tight truncate leading-6">{user.username}</span>
                </div>
                <div className="flex sm:hidden items-center gap-1.5 pl-9">
                    <Mail className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                    <span className="text-[11px] text-muted-foreground/60 truncate italic leading-tight">{user.email}</span>
                </div>
            </div>

            {/* Email Column (Desktop Only) */}
            <div className="hidden sm:flex items-center gap-2 overflow-hidden px-2 leading-6">
                <Mail className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                <span className="text-[12px] text-muted-foreground/70 truncate">{user.email}</span>
            </div>

            {/* Date & ID Column */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 pl-9 sm:pl-0 leading-6">
                <div className="text-[11px] font-mono text-muted-foreground/40 uppercase tracking-tighter pt-0.5">
                    {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex sm:hidden items-center">
                    <code className="text-[9px] font-mono text-muted-foreground/30 truncate">ID: {user.id.split('-')[0]}</code>
                </div>
            </div>

            {/* ID Column (Desktop Only - Baseline aligned) */}
            <div className="hidden sm:flex items-center leading-6">
                <code className="text-[10px] font-mono text-muted-foreground/30 truncate pt-0.5">#{user.id.split('-')[0]}</code>
            </div>

            {/* Actions (Anchored Right, Baseline aligned, Intent-based Opacity) */}
            <div className="flex items-start justify-end pr-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm hover:bg-muted/80 transition-colors">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-lg border-border/40 shadow-xl bg-card">
                        <DropdownMenuItem onClick={() => onEdit(user)} className="text-xs py-2 cursor-pointer gap-2">
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground/70" />
                            Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(user.id)}
                            className="text-xs py-2 text-destructive focus:text-destructive cursor-pointer gap-2"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
