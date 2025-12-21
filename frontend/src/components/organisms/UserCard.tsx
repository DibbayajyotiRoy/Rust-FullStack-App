import { MoreHorizontal, Pencil, Trash2, Mail, User as UserIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
        <Card className="group relative overflow-hidden bg-card border-border/40 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-3xl">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                            <UserIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">{user.username}</h3>
                            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="text-sm font-medium">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-accent/50">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border/40">
                            <DropdownMenuItem onClick={() => onEdit(user)} className="gap-2 cursor-pointer">
                                <Pencil className="h-4 w-4" />
                                Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(user.id)}
                                className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                    <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    <Badge variant="secondary" className="rounded-full px-3 py-0 scale-90 bg-accent/50 text-foreground">
                        {user.id.split('-')[0]}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
