import { create } from 'zustand';
import { api } from '@/lib/api';
import type { User } from '@/types/user';
import { toast } from 'sonner';

interface UsersState {
    users: User[];
    isLoading: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const users = await api.get<User[]>('/api/users');
            set({ users, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch users', isLoading: false });
            toast.error('Failed to fetch users');
        }
    }
}));
