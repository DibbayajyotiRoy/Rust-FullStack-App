import { create } from 'zustand';
import { toast } from "sonner";
import type { User, UserPayload } from "@/types/user";
import { userService } from "@/services/user.service";
import { useEffect } from 'react';

interface UserState {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (payload: UserPayload) => Promise<void>;
  updateUser: (id: string, payload: UserPayload) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    if (get().loading) return;
    try {
      set({ loading: true });
      const users = await userService.list();
      set({ users, loading: false });
    } catch {
      toast.error("Failed to load users");
      set({ loading: false });
    }
  },
  createUser: async (payload) => {
    try {
      await userService.create(payload);
      toast.success("User created");
      get().fetchUsers();
    } catch {
      toast.error("Failed to create user");
    }
  },
  updateUser: async (id, payload) => {
    try {
      await userService.update(id, payload);
      toast.success("User updated");
      get().fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  },
  deleteUser: async (id) => {
    try {
      await userService.delete(id);
      toast.success("User deleted");
      get().fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  },
}));

/**
 * Hook for using users with automatic fetching.
 * Maintains compatibility with previous implementation while using the global store.
 */
export function useUsers() {
  const store = useUserStore();

  useEffect(() => {
    // Only fetch if we haven't loaded yet
    if (store.users.length === 0 && !store.loading) {
      store.fetchUsers();
    }
  }, [store]);

  return store;
}
