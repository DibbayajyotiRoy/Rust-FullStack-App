import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Policy } from '@/types/user';
import { toast } from 'sonner';

interface PoliciesState {
    policies: Policy[];
    isLoading: boolean;
    error: string | null;

    fetchPolicies: () => Promise<void>;
    createPolicy: (payload: { name: string; description: string; content: any }) => Promise<void>;
    archivePolicy: (id: string) => Promise<void>;
}

export const usePoliciesStore = create<PoliciesState>((set, get) => ({
    policies: [],
    isLoading: false,
    error: null,

    fetchPolicies: async () => {
        set({ isLoading: true, error: null });
        try {
            const policies = await api.get<Policy[]>('/api/management/policies');
            set({ policies, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch policies', isLoading: false });
            toast.error('Failed to fetch policies');
        }
    },

    createPolicy: async (payload) => {
        try {
            await api.post('/api/management/policies', payload);
            toast.success('Policy created successfully');
            get().fetchPolicies();
        } catch (error) {
            toast.error('Failed to create policy');
            throw error;
        }
    },

    archivePolicy: async (id: string) => {
        try {
            await api.post(`/api/management/policies/${id}/archive`, {});
            toast.success('Policy archived successfully');
            get().fetchPolicies();
        } catch (error) {
            toast.error('Failed to archive policy');
        }
    }
}));
