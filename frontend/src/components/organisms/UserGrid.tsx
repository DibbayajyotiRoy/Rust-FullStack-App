import { User } from "@/types/user"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
