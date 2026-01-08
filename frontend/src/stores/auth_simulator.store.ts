import { create } from 'zustand';
import { api } from '@/lib/api';
import type { AuthContext, Decision } from '@/types/user';
import { toast } from 'sonner';

interface AuthSimulatorState {
    decision: Decision | null;
    isSimulating: boolean;
    error: string | null;

    simulate: (payload: { action: string; resource: string; context: AuthContext }) => Promise<void>;
    clearDecision: () => void;
}

export const useAuthSimulatorStore = create<AuthSimulatorState>((set) => ({
    decision: null,
    isSimulating: false,
    error: null,

    simulate: async (payload) => {
        set({ isSimulating: true, error: null, decision: null });
        try {
            const decision = await api.post<Decision>('/api/management/simulate', payload);
            set({ decision, isSimulating: false });
            if (decision.allowed) {
                toast.success('Action Allowed');
            } else {
                toast.error('Action Denied');
            }
        } catch (error) {
            set({ error: 'Simulation failed', isSimulating: false });
            toast.error('Simulation failed');
        }
    },

    clearDecision: () => set({ decision: null, error: null })
}));
