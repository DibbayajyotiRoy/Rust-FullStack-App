import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Policy, PolicyRule, PolicyBinding } from '@/types/user';
import { toast } from 'sonner';

interface PoliciesState {
    policies: Policy[];
    currentRules: PolicyRule[];
    currentBindings: PolicyBinding[];
    isLoading: boolean;
    error: string | null;

    fetchPolicies: () => Promise<void>;
    fetchPolicyDetails: (id: string) => Promise<void>;
    createPolicy: (payload: { policy_number: number; name: string; description?: string }) => Promise<void>;
    activatePolicy: (id: string) => Promise<void>;
    archivePolicy: (id: string) => Promise<void>;
    deletePolicy: (id: string) => Promise<void>;
    addRule: (policyId: string, rule: Omit<PolicyRule, 'id' | 'policy_id' | 'created_at'>) => Promise<void>;
    removeRule: (policyId: string, ruleId: string) => Promise<void>;
    bindSubject: (policyId: string, subjectType: 'role' | 'user', subjectId: string) => Promise<void>;
    unbindSubject: (policyId: string, bindingId: string) => Promise<void>;
}

export const usePoliciesStore = create<PoliciesState>((set, get) => ({
    policies: [],
    currentRules: [],
    currentBindings: [],
    isLoading: false,
    error: null,

    fetchPolicies: async () => {
        set({ isLoading: true, error: null });
        try {
            const policies = await api.get<Policy[]>('/api/management/policies');
            set({ policies: Array.isArray(policies) ? policies : [], isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch policies', isLoading: false });
            toast.error('Failed to fetch policies');
        }
    },

    fetchPolicyDetails: async (id: string) => {
        set({ isLoading: true, currentRules: [], currentBindings: [] });
        try {
            // In a real app we might have a single detail endpoint, 
            // but here we might need to fetch rules and bindings separately if needed.
            // For now, we assume the policy list is enough or we add rules/bindings fetching.
            // Let's assume we have endpoints for rules and bindings per policy.
            const [rules, bindings] = await Promise.all([
                api.get<PolicyRule[]>(`/api/management/policies/${id}/rules`).catch(() => []),
                api.get<PolicyBinding[]>(`/api/management/policies/${id}/bindings`).catch(() => [])
            ]);
            set({ currentRules: rules, currentBindings: bindings, isLoading: false });
        } catch (error) {
            set({ error: 'Failed to fetch policy details', isLoading: false });
        }
    },

    createPolicy: async (payload) => {
        try {
            await api.post('/api/management/policies', payload);
            toast.success('Policy draft created successfully');
            get().fetchPolicies();
        } catch (error) {
            toast.error('Failed to create policy');
            throw error;
        }
    },

    activatePolicy: async (id: string) => {
        try {
            await api.post(`/api/management/policies/${id}/activate`, {});
            toast.success('Policy activated successfully');
            get().fetchPolicies();
        } catch (error) {
            toast.error('Failed to activate policy');
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
    },

    deletePolicy: async (id: string) => {
        try {
            await api.delete(`/api/management/policies/${id}`);
            toast.success('Policy deleted successfully');
            get().fetchPolicies();
        } catch (error) {
            toast.error('Failed to delete policy');
        }
    },

    addRule: async (policyId, rule) => {
        try {
            await api.post(`/api/management/policies/${policyId}/rules`, rule);
            toast.success('Rule added successfully');
            get().fetchPolicyDetails(policyId);
        } catch (error) {
            toast.error('Failed to add rule');
        }
    },

    removeRule: async (policyId, ruleId) => {
        try {
            await api.delete(`/api/management/policies/rules/${ruleId}`);
            toast.success('Rule removed successfully');
            get().fetchPolicyDetails(policyId);
        } catch (error) {
            toast.error('Failed to remove rule');
        }
    },

    bindSubject: async (policyId, subjectType, subjectId) => {
        try {
            await api.post(`/api/management/policies/${policyId}/bind`, {
                subject_type: subjectType,
                subject_id: subjectId
            });
            toast.success(`Policy bound to ${subjectType}`);
            get().fetchPolicyDetails(policyId);
        } catch (error) {
            toast.error('Failed to bind policy');
        }
    },

    unbindSubject: async (policyId, bindingId) => {
        try {
            await api.delete(`/api/management/policies/bindings/${bindingId}`);
            toast.success('Subject unbinded successfully');
            get().fetchPolicyDetails(policyId);
        } catch (error) {
            toast.error('Failed to unbind subject');
        }
    }
}));
