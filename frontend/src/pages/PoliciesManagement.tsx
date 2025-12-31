import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { Button } from '@/components/ui/button';
import { FileText, Plus, History, Archive, Settings2, CheckCircle2, X, Save } from 'lucide-react';
import { usePoliciesStore } from '@/stores/policies.store';
import { useRolesStore } from '@/stores/roles.store';
import type { Policy } from '@/types/user';
import { toast } from 'sonner';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    policy?: Policy; // If provided, it's edit mode
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policy }) => {
    const { createPolicy } = usePoliciesStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (policy) {
            setName(policy.name);
            setDescription(policy.description || '');
        } else {
            setName('');
            setDescription('');
        }
    }, [policy, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (policy) {
                // Update logic would go here if we had an update endpoint
                toast.info('Update policy feature coming soon');
            } else {
                await createPolicy({ name, description, content: {} });
            }
            onClose();
        } catch (error) {
            // Error handled in store
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 scale-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[var(--color-foreground)]">
                        {policy ? 'Edit Policy' : 'Create New Policy'}
                    </h2>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        Define the operational parameters and rules for this policy.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                            Policy Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="e.g. Data Retention Policy"
                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[var(--color-foreground)]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Briefly describe the purpose of this policy..."
                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[var(--color-foreground)] resize-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 inactive:scale-[0.98]"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save size={16} />
                                    {policy ? 'Save Changes' : 'Create Policy'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PoliciesManagement: React.FC = () => {
    const { user } = useAuth();
    const { policies, fetchPolicies, isLoading, archivePolicy } = usePoliciesStore();
    const { roles, fetchRoles } = useRolesStore();

    const [iscreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<Policy | undefined>(undefined);

    useEffect(() => {
        fetchPolicies();
        fetchRoles();
    }, []);

    const userLevel = user?.role_id ? roles?.find(r => r.id === user.role_id)?.level ?? 999 : 999;
    const isSuperadmin = userLevel === 0 || user?.role_id === '00000000-0000-0000-0000-000000000000';

    const handleEdit = (policy: Policy) => {
        setEditingPolicy(policy);
        setIsCreateModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPolicy(undefined);
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setEditingPolicy(undefined);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">System Policies</h1>
                    <p className="type-secondary">Manage versioned operational policies and hierarchical access</p>
                </div>
                {isSuperadmin && (
                    <Button
                        size="sm"
                        onClick={handleCreate}
                        className="gap-2"
                    >
                        <Plus size={16} />
                        New Policy
                    </Button>
                )}
            </div>

            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--color-muted)]/50 border-b border-[var(--color-border)]">
                            <th className="px-6 py-4 text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Policy ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Name & Description</th>
                            <th className="px-6 py-4 text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Version</th>
                            <th className="px-6 py-4 text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                        <span className="text-sm text-[var(--color-muted-foreground)]">Loading policies...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : policies.length > 0 ? (
                            policies.map((p) => (
                                <tr key={p.id} className="hover:bg-[var(--color-muted)]/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-bold text-blue-500">#{p.policy_number}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[var(--color-foreground)]">{p.name}</div>
                                        <div className="text-xs text-[var(--color-muted-foreground)] mt-1 line-clamp-1 max-w-[300px]">{p.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold bg-[var(--color-muted)] text-[var(--color-foreground)] px-2 py-1 rounded-lg">v{p.current_version}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.is_archived ? (
                                            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-full w-fit">
                                                <Archive size={12} />
                                                Archived
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full w-fit">
                                                <CheckCircle2 size={12} />
                                                Active
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-[var(--color-muted)] rounded-lg text-[var(--color-muted-foreground)] transition-colors" title="History">
                                                <History size={16} />
                                            </button>
                                            {isSuperadmin && !p.is_archived && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(p)}
                                                        className="p-2 hover:bg-[var(--color-muted)] rounded-lg text-[var(--color-muted-foreground)] transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Settings2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to archive this policy?')) {
                                                                archivePolicy(p.id);
                                                            }
                                                        }}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                                                        title="Archive"
                                                    >
                                                        <Archive size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-[var(--color-muted)]/50 rounded-full flex items-center justify-center mb-4 text-[var(--color-muted-foreground)]">
                                            <FileText size={32} />
                                        </div>
                                        <h3 className="font-bold text-[var(--color-foreground)] text-lg">No policies found</h3>
                                        <p className="text-[var(--color-muted-foreground)] text-sm mt-1 max-w-xs mx-auto">
                                            Get started by creating your first versioned policy to manage system access.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Policy Modal */}
            <PolicyModal
                isOpen={iscreateModalOpen}
                onClose={handleCloseModal}
                policy={editingPolicy}
            />
        </div>
    );
};

export default PoliciesManagement;
