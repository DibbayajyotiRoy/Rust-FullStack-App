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
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-4 rounded-3xl">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter">Directory</h1>
                            <p className="text-muted-foreground font-medium">Manage your team and their permissions.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <ThemeToggle />
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-2xl px-6 py-6 h-auto text-lg font-bold gap-2 shadow-lg shadow-primary/20">
                                    <Plus className="h-5 w-5" />
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md rounded-3xl border-border/40">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tight">Add New User</DialogTitle>
                                </DialogHeader>
                                <UserForm onSubmit={handleAddUser} onCancel={() => setIsAddDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </header>

                {/* Search Section */}
                <div className="flex justify-center mb-12">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />
                </div>

                {/* Main Content */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center p-24 gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground animate-pulse font-medium">Syncing with database...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <UserGrid
                            users={filteredUsers}
                            onEdit={setEditingUser}
                            onDelete={handleDeleteUser}
                        />
                    </div>
                )}

                {/* Edit Dialog */}
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogContent className="sm:max-w-md rounded-3xl border-border/40">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black tracking-tight">Edit User Profile</DialogTitle>
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
