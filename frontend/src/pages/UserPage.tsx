import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { SearchBar } from "@/components/molecules/SearchBar"
import { UserGrid } from "@/components/organisms/UserGrid"
import { UserForm } from "@/components/organisms/UserForm"

import type { User, UserPayload } from "@/types/user"
import { useUsers } from "@/state/user.store"

function UserPage() {
  const {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers()

  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  // ---------- Handlers ----------
  const handleCreate = async (payload: UserPayload) => {
    await createUser(payload)
    setAddOpen(false)
  }

  const handleUpdate = async (payload: UserPayload) => {
    if (!editingUser) return
    await updateUser(editingUser.id, payload)
    setEditingUser(null)
  }

  // ---------- Render ----------
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Employees
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage employees, access, and profiles
          </p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Add Employee</DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreate}
              onCancel={() => setAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <span className="text-xs text-muted-foreground">
          {filteredUsers.length} employees
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading employees…
        </div>
      ) : (
        <UserGrid
          users={filteredUsers}
          onEdit={setEditingUser}
          onDelete={deleteUser}
        />
      )}

      {/* Edit dialog */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>

          {editingUser && (
            <UserForm
              initialData={editingUser}
              onSubmit={handleUpdate}
              onCancel={() => setEditingUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserPage
