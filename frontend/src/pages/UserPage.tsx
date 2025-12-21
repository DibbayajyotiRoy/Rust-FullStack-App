import { useState, useEffect } from "react"
import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { User, UserPayload } from "@/types/user"
import { SearchBar } from "@/components/molecules/SearchBar"
import { UserForm } from "@/components/molecules/UserForm"
import { UserGrid } from "@/components/organisms/UserGrid"
import { ThemeToggle } from "@/components/atoms/ThemeToggle"

const API_URL = "/api/users"

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(API_URL)
            if (!response.ok) throw new Error("Failed to fetch users")
            const data = await response.json()
            setUsers(data)
        } catch (err) {
            toast.error("Could not load users")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddUser = async (payload: UserPayload) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!response.ok) throw new Error("Create failed")
            await fetchUsers()
            setIsAddDialogOpen(false)
            toast.success("User created successfully")
        } catch (err) {
            toast.error("Failed to create user")
        }
    }

    const handleUpdateUser = async (payload: UserPayload) => {
        if (!editingUser) return
        try {
            const response = await fetch(`${API_URL}/${editingUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!response.ok) throw new Error("Update failed")
            await fetchUsers()
            setEditingUser(null)
            toast.success("User updated successfully")
        } catch (err) {
            toast.error("Failed to update user")
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            })
            if (!response.ok) throw new Error("Delete failed")
            await fetchUsers()
            toast.success("User deleted")
        } catch (err) {
            toast.error("Failed to delete user")
        }
    }

    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 antialiased">
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Header Section */}
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <Users className="h-5 w-5 text-primary/80" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">User Directory</h1>
                            <p className="text-[12px] text-muted-foreground/60 font-medium">Manage organization members and roles.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="rounded-md px-4 h-8 text-xs font-bold gap-2 shadow-sm">
                                    <Plus className="h-3.5 w-3.5" />
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px] rounded-xl border-border/40 p-4">
                                <DialogHeader className="mb-2">
                                    <DialogTitle className="text-lg font-bold tracking-tight">Create User</DialogTitle>
                                </DialogHeader>
                                <UserForm onSubmit={handleAddUser} onCancel={() => setIsAddDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </header>

                {/* Utility Bar */}
                <div className="flex items-center justify-between mb-6 gap-4 border-b border-border/10 pb-6">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />
                    <div className="text-[11px] font-mono text-muted-foreground/40 whitespace-nowrap">
                        {filteredUsers.length} TOTAL USERS
                    </div>
                </div>

                {/* Main Content */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center p-12 gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary/50"></div>
                        <p className="text-[11px] text-muted-foreground/50 font-mono tracking-widest uppercase">Syncing...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                        <UserGrid
                            users={filteredUsers}
                            onEdit={setEditingUser}
                            onDelete={handleDeleteUser}
                        />
                    </div>
                )}

                {/* Edit Dialog */}
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent className="sm:max-w-[400px] rounded-xl border-border/40 p-4">
                        <DialogHeader className="mb-2">
                            <DialogTitle className="text-lg font-bold tracking-tight">Update Profile</DialogTitle>
                        </DialogHeader>
                        {editingUser && (
                            <UserForm
                                initialData={editingUser}
                                onSubmit={handleUpdateUser}
                                onCancel={() => setEditingUser(null)}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
