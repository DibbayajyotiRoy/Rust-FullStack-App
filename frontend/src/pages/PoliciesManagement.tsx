import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Search,
    Plus,
    Archive,
    X,
    Save,
    Settings2,
    FileText,
    Trash2,
    Info,
    ExternalLink,
    Clock,
    ShieldCheck
} from 'lucide-react';
import { usePoliciesStore } from '@/stores/policies.store';
import { useRolesStore } from '@/stores/roles.store';
import { PolicyStatus, type Policy } from '@/types/user';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// --- Components ---

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose }) => {
    const { createPolicy } = usePoliciesStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPolicy({
            name,
            description,
            policy_number: parseInt(policyNumber)
        });
        onClose();
        setName('');
        setDescription('');
        setPolicyNumber('');
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl w-full max-w-md shadow-2xl p-8 relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-foreground)] tracking-tight">New Policy Draft</h2>
                        <p className="text-[var(--color-muted-foreground)] text-[10px] uppercase font-bold tracking-wider">PBAC Governance</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-muted)] rounded-lg transition-colors text-[var(--color-muted-foreground)]">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-[var(--color-muted-foreground)] tracking-wider px-1">Identifier</label>
                        <input
                            type="number"
                            required
                            placeholder="e.g. 101"
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e as any); }}
                            className="w-full bg-[var(--color-muted)]/30 border border-[var(--color-border)] rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-[var(--color-muted-foreground)] tracking-wider px-1">Name</label>
                        <input
                            required
                            placeholder="e.g. Finance Read Access"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e as any); }}
                            className="w-full bg-[var(--color-muted)]/30 border border-[var(--color-border)] rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-[var(--color-muted-foreground)] tracking-wider px-1">Description</label>
                        <textarea
                            required
                            placeholder="Purpose of this policy..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-24 bg-[var(--color-muted)]/30 border border-[var(--color-border)] rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 h-10 rounded-xl text-xs">Cancel</Button>
                        <Button type="submit" className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm text-xs font-bold">
                            <Save size={14} />
                            Save Draft
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PolicyDetailModal: React.FC<{ policy: Policy | null; isOpen: boolean; onClose: () => void }> = ({ policy, isOpen, onClose }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen || !policy) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-[var(--color-foreground)]">{policy.name}</h2>
                            <span className="text-[10px] font-mono text-blue-500">P-{policy.policy_number}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-muted)] rounded-lg transition-colors text-[var(--color-muted-foreground)]">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted-foreground)]">Description</h4>
                        <p className="text-xs text-[var(--color- foreground)] leading-relaxed">
                            {policy.description || 'No description provided for this policy.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[var(--color-muted)]/30 rounded-2xl border border-[var(--color-border)]">
                            <div className="flex items-center gap-2 text-emerald-500 mb-1">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
                            </div>
                            <span className="text-xs font-bold capitalize">{policy.status}</span>
                        </div>
                        <div className="p-4 bg-[var(--color-muted)]/30 rounded-2xl border border-[var(--color-border)]">
                            <div className="flex items-center gap-2 text-blue-500 mb-1">
                                <Clock size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Modified</span>
                            </div>
                            <span className="text-xs font-bold">{format(new Date(policy.updated_at), 'MMM dd, HH:mm')}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted-foreground)]">Rule Summary</h4>
                            <div className="text-[10px] font-bold text-blue-600">
                                {policy.allow_count + policy.deny_count} Total Rules
                            </div>
                        </div>
                        <div className="flex gap-1 h-2 bg-[var(--color-muted)] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${(policy.allow_count / (policy.allow_count + policy.deny_count || 1)) * 100}%` }} />
                            <div className="h-full bg-red-500" style={{ width: `${(policy.deny_count / (policy.allow_count + policy.deny_count || 1)) * 100}%` }} />
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[var(--color-muted)]/10 border-t border-[var(--color-border)] flex gap-3">
                    <Button
                        onClick={() => navigate(`/access-control/policies/${policy.id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5 font-bold shadow-lg shadow-blue-500/20 gap-2"
                    >
                        <Settings2 size={16} />
                        Open Full Access Manager
                    </Button>
                </div>
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const isDraft = status === PolicyStatus.Draft;
    const isActive = status === PolicyStatus.Active;

    return (
        <div className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1 w-fit",
            isDraft ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    "bg-amber-500/10 text-amber-500 border-amber-500/20"
        )}>
            {status}
        </div>
    );
};

const PolicyTable: React.FC<{
    policies: Policy[];
    isLoading: boolean;
    onSelectPolicy: (p: Policy) => void;
    onMigrate: (id: string) => void;
    onArchive: (id: string) => void;
    onDelete: (id: string) => void;
}> = React.memo(({ policies, isLoading, onSelectPolicy, onMigrate, onArchive, onDelete }) => {
    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
                <thead>
                    <tr className="bg-[var(--color-muted)]/30 border-b border-[var(--color-border)]">
                        <th className="w-2/5 px-6 py-4 text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Policy</th>
                        <th className="w-1/6 px-6 py-4 text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Status</th>
                        <th className="w-1/5 px-6 py-4 text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider text-center">Rules</th>
                        <th className="w-1/4 px-6 py-4 text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="py-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></div>
                            </td>
                        </tr>
                    ) : policies.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-12 text-center text-xs text-[var(--color-muted-foreground)] italic font-medium">
                                No policies found matching your criteria.
                            </td>
                        </tr>
                    ) : (
                        policies.map((policy) => (
                            <tr
                                key={policy.id}
                                className="hover:bg-[var(--color-muted)]/10 transition-colors cursor-pointer group"
                                onClick={() => onSelectPolicy(policy)}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                                            <FileText size={16} />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-bold text-xs truncate text-[var(--color-foreground)]">{policy.name}</span>
                                            <span className="text-[9px] font-mono text-blue-500 mt-0.5">P-{policy.policy_number}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={policy.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className="text-[9px] font-bold flex items-center gap-2">
                                            <span className="text-emerald-500">{policy.allow_count} Allow</span>
                                            <span className="text-red-500">{policy.deny_count} Deny</span>
                                        </div>
                                        <div className="w-16 h-1 bg-[var(--color-muted)] rounded-full overflow-hidden flex">
                                            {policy.allow_count + policy.deny_count > 0 ? (
                                                <>
                                                    <div
                                                        className="h-full bg-emerald-500"
                                                        style={{ width: `${(policy.allow_count / (policy.allow_count + policy.deny_count)) * 100}%` }}
                                                    />
                                                    <div
                                                        className="h-full bg-red-500"
                                                        style={{ width: `${(policy.deny_count / (policy.allow_count + policy.deny_count)) * 100}%` }}
                                                    />
                                                </>
                                            ) : (
                                                <div className="h-full bg-[var(--color-muted)]/50 w-full" />
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => onMigrate(policy.id)}
                                            className="p-1.5 text-[var(--color-muted-foreground)] hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                            title="Manage Policy"
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                        {policy.status === PolicyStatus.Active && (
                                            <button
                                                onClick={() => onArchive(policy.id)}
                                                className="p-1.5 text-[var(--color-muted-foreground)] hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all"
                                                title="Archive"
                                            >
                                                <Archive size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                if (window.confirm('PERMANENTLY delete this policy?')) {
                                                    onDelete(policy.id);
                                                }
                                            }}
                                            className="p-1.5 text-[var(--color-muted-foreground)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}, (prev, next) => {
    // Custom comparison to avoid re-renders if policies haven't changed deep
    // But since policies is filtered, shallow comparison of the array ref (from useMemo) is enough if react handles it right.
    // React.memo default comparison is shallow compare of props.
    // prev.policies === next.policies will be true if useMemo works.
    return prev.policies === next.policies && prev.isLoading === next.isLoading;
});

const PoliciesManagement: React.FC = () => {
    const navigate = useNavigate();
    const { policies, fetchPolicies, archivePolicy, deletePolicy, isLoading } = usePoliciesStore();
    const { fetchRoles } = useRolesStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

    useEffect(() => {
        fetchPolicies();
        fetchRoles();
    }, []);

    const filteredPolicies = React.useMemo(() => policies.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.policy_number.toString().includes(searchQuery)
    ), [policies, searchQuery]);

    const handlePolicyClick = React.useCallback((policy: Policy) => {
        setSelectedPolicy(policy);
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 italic-none" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm ring-1 ring-blue-700/10">
                        <Shield size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-[var(--color-foreground)] tracking-tight">Policies</h1>
                        <div className="relative">
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                title="Click to view details"
                                className={cn(
                                    "p-1 rounded-md transition-colors",
                                    showInfo ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                                )}
                            >
                                <Info size={16} />
                            </button>
                            {showInfo && (
                                <div className="absolute top-full left-0 mt-2 w-80 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl z-50 animate-in slide-in-from-top-1 duration-200">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Governance Guide</h3>
                                    <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                                        This system uses <strong>Policy-Based Access Control (PBAC)</strong>. Permissions are derived from active policies bound to subjects. Roles are passive groupings. Changes to Active policies require creating a new Draft.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" size={14} />
                        <input
                            placeholder="Search policies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-[var(--color-muted)]/30 border border-[var(--color-border)] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-48 font-medium"
                        />
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        size="sm"
                        className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs font-bold"
                    >
                        <Plus size={14} />
                        New Draft
                    </Button>
                </div>
            </header>

            <PolicyTable
                policies={filteredPolicies}
                isLoading={isLoading}
                onSelectPolicy={handlePolicyClick}
                onMigrate={(id) => navigate(`/access-control/policies/${id}`)}
                onArchive={archivePolicy}
                onDelete={deletePolicy}
            />

            <PolicyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <PolicyDetailModal
                policy={selectedPolicy}
                isOpen={!!selectedPolicy}
                onClose={() => setSelectedPolicy(null)}
            />
        </div>
    );
};

export default PoliciesManagement;
