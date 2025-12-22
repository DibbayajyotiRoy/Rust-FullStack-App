import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User, UserPayload } from "@/types/user"

interface UserFormProps {
  initialData?: User
  onSubmit: (data: UserPayload) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: UserFormProps) {
  const [formData, setFormData] = React.useState<UserPayload>({
    username: initialData?.username ?? "",
    email: initialData?.email ?? "",
    password_hash: initialData?.password_hash ?? "",
  })

  function handleChange<K extends keyof UserPayload>(
    key: K,
    value: UserPayload[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="johndoe"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
      </div>

      {/* Password (optional / future-ready) */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder={
            initialData ? "Leave unchanged" : "Set password"
          }
          value={formData.password_hash}
          onChange={(e) =>
            handleChange("password_hash", e.target.value)
          }
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update User"
            : "Create User"}
        </Button>
      </div>
    </form>
  )
}
