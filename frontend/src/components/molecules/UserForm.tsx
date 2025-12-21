import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User, UserPayload } from "@/types/user"

interface UserFormProps {
    initialData?: User
    onSubmit: (data: UserPayload) => void
    onCancel: () => void
    isLoading?: boolean
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
    const [formData, setFormData] = useState<UserPayload>({
        username: initialData?.username || "",
        email: initialData?.email || "",
        password_hash: initialData?.password_hash || "default_or_managed", // Simple for now
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="johndoe"
                        className="rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="rounded-xl"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="rounded-xl px-8">
                    {isLoading ? "Saving..." : initialData ? "Update User" : "Create User"}
                </Button>
            </div>
        </form>
    )
}
