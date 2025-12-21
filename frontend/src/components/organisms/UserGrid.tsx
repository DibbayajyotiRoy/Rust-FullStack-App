import type { User } from "@/types/user"
import { UserCard } from "./UserCard"

interface UserGridProps {
    users: User[]
    onEdit: (user: User) => void
    onDelete: (id: string) => void
}

export function UserGrid({ users, onEdit, onDelete }: UserGridProps) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border/40 rounded-[2rem] bg-accent/5">
                <p className="text-muted-foreground text-lg">No users found matching your search.</p>
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-0 sm:min-w-[800px]">
                {/* Header labels - Hidden on mobile, visible on desktop */}
                <div className="hidden sm:grid grid-cols-[200px_1fr_140px_100px_80px] items-center px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Joined</div>
                    <div>ID</div>
                    <div className="text-right">Actions</div>
                </div>

                <div className="flex flex-col border border-border/40 rounded-lg overflow-hidden bg-card/30">
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
