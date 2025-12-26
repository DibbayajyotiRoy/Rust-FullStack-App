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

import { UserForm } from "@/components/organisms/UserForm"
import { DataTable } from "@/components/organisms/DataTable/DataTable"
import { userColumns } from "@/components/organisms/UserTable/columns"

import { useNavigate } from "react-router-dom"
import type { User, UserPayload } from "@/types/user"
import { useUsers } from "@/state/user.store"

function UserPage() {
  const navigate = useNavigate()
  const {
    users,
    loading,
    createUser,
    updateUser,
  } = useUsers()

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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
          <h1 className="text-lg font-semibold type-header">
            Employees
          </h1>
          <p className="type-secondary">
            Manage employees, access, and profiles
          </p>
        </div>
      </div>

      {/* Content */}
      <DataTable
        data={filteredUsers.slice((page - 1) * pageSize, page * pageSize)}
        columns={userColumns}
        total={filteredUsers.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        isLoading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        onRowClick={(user) => navigate(`/users/${user.id}`)}
        mainActions={
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
        }
      />

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
