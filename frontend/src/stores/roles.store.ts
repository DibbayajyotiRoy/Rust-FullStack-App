import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Role, Policy } from '@/types/user';
import { toast } from 'sonner';

interface RolesState {
    roles: Role[];
    rolePolicies: Record<string, Policy[]>; // Cache policies per role
    isLoading: boolean;
    error: string | null;

    fetchRoles: () => Promise<void>;
    fetchRolePolicies: (roleId: string) => Promise<void>;
    assignPolicy: (roleId: string, policyId: string) => Promise<void>;
}

export const useRolesStore = create<RolesState>((set, get) => ({
    roles: [],
    rolePolicies: {},
    isLoading: false,
    error: null,

    fetchRoles: async () => {
        set({ isLoading: true, error: null });
        try {
            const roles = await api.get<Role[]>('/api/management/roles');
            set({ roles, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch roles', isLoading: false });
            toast.error('Failed to fetch roles');
        }
    },

    fetchRolePolicies: async (roleId: string) => {
        // Optional: Check if already cached? For now, we fetch fresh to ensure accuracy.
        try {
            const policies = await api.get<Policy[]>(`/api/management/roles/${roleId}/policies`);
            set((state) => ({
                rolePolicies: { ...state.rolePolicies, [roleId]: policies }
            }));
        } catch (error) {
            console.error(`Failed to fetch policies for role ${roleId}`);
        }
    },

    assignPolicy: async (roleId: string, policyId: string) => {
        try {
            await api.post(`/api/management/policies/${policyId}/assign`, { role_id: roleId });
            toast.success('Policy assigned successfully');
            // Refresh policies for this role
            await get().fetchRolePolicies(roleId);
        } catch (error) {
            toast.error('Failed to assign policy');
        }
    }
}));
