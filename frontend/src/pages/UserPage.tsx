import { useState, useMemo } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

import { UserForm } from "@/components/organisms/UserForm"
import { DataTable } from "@/components/organisms/DataTable/DataTable"
import { getUserColumns } from "@/components/organisms/UserTable/columns"

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const { deleteUser } = useUsers()

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

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds)
    if (checked) next.add(id)
    else next.delete(id)
    setSelectedIds(next)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredUsers.map(u => u.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleDeleteSelected = async () => {
    for (const id of Array.from(selectedIds)) {
      await deleteUser(id)
    }
    setSelectedIds(new Set())
    setDeleteConfirmOpen(false)
  }

  const isAllSelected = filteredUsers.length > 0 && selectedIds.size === filteredUsers.length

  const columns = useMemo(() => getUserColumns({
    selectedIds,
    onSelectRow: handleSelectRow,
    onSelectAll: handleSelectAll,
    isAllSelected
  }), [selectedIds, isAllSelected])

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
        columns={columns}
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
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 animate-in fade-in slide-in-from-right-2 text-danger hover:text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                    <span className="text-danger">Delete ({selectedIds.size})</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Employees</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {selectedIds.size} selected employee{selectedIds.size > 1 ? 's' : ''}? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button
                      variant="ghost"
                      onClick={handleDeleteSelected}
                      className="text-danger hover:text-danger hover:bg-danger/10 font-semibold"
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
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
