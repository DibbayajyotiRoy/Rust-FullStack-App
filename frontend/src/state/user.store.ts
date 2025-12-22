import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { User, UserPayload } from "@/types/user";
import { userService } from "@/services/user.service";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      setLoading(true);
      setUsers(await userService.list());
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function createUser(payload: UserPayload) {
    try {
      await userService.create(payload);
      toast.success("User created");
      fetchUsers();
    } catch {
      toast.error("Failed to create user");
    }
  }

  async function updateUser(id: string, payload: UserPayload) {
    try {
      await userService.update(id, payload);
      toast.success("User updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  }

  async function deleteUser(id: string) {
    try {
      await userService.delete(id);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    createUser,
    updateUser,
    deleteUser,
  };
}
