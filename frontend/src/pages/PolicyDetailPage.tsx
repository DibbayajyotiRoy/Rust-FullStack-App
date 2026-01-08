import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePoliciesStore } from '@/stores/policies.store';
import { useRolesStore } from '@/stores/roles.store';
import { useUsersStore } from '@/stores/users.store';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    Shield,
    ShieldAlert,
    Plus,
    Trash2,
    CheckCircle2,
    Archive,
    Info,
    Search,
    X
} from 'lucide-react';
import { PolicyStatus } from '@/types/user';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const RESOURCE_OPTIONS = ['*', 'users', 'policies', 'roles', 'settings', 'audit_logs', 'reports', 'payroll', 'inventory'];
const ACTION_OPTIONS = ['*', 'read', 'write', 'create', 'update', 'delete', 'manage', 'execute'];

const PolicyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        policies,
        currentRules,
        currentBindings,
        fetchPolicies,
        fetchPolicyDetails,
        isLoading,
        activatePolicy,
        archivePolicy,
        addRule,
        removeRule,
        bindSubject,
        unbindSubject,
        deletePolicy
    } = usePoliciesStore();

    const { roles, fetchRoles } = useRolesStore();
    const { users, fetchUsers } = useUsersStore();

    const [activeTab, setActiveTab] = useState<'rules' | 'bindings'>('rules');
    const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
    const [selectedResources, setSelectedResources] = useState<string[]>([]);
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    const policy = policies.find(p => p.id === id);

    useEffect(() => {
        if (id) {
            fetchPolicies();
            fetchPolicyDetails(id);
            fetchRoles();
            fetchUsers();
        }
    }, [id]);

    if (!policy && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <ShieldAlert size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold">Policy Not Found</h2>
                <Button variant="link" onClick={() => navigate('/access-control/policies')} className="mt-2">
                    Back to Policies
                </Button>
            </div>
        );
    }

    const isDraft = policy?.status === PolicyStatus.Draft;
    const isActive = policy?.status === PolicyStatus.Active;

    const handleActivate = async () => {
        if (window.confirm('Activate this policy? It will immediately govern system actions and become immutable.')) {
            await activatePolicy(id!);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/access-control/policies')}
                        className="p-1.5 hover:bg-[var(--color-muted)] rounded-lg transition-colors text-[var(--color-muted-foreground)]"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] font-bold text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">P-{policy?.policy_number}</span>
                        <h1 className="text-xl font-bold tracking-tight">{policy?.name}</h1>
                        <div className="relative">
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                title="Click to view details"
                                className={cn(
                                    "p-1 rounded-md transition-colors",
                                    showInfo ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                                )}
                            >
                                <Info size={14} />
                            </button>
                            {showInfo && (
                                <div className="absolute top-full left-0 mt-2 w-80 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl z-50 animate-in slide-in-from-top-1 duration-200">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Policy Metadata</h3>
                                    <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-3">
                                        {policy?.description || 'No detailed description provided.'}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] text-[var(--color-muted-foreground)]">
                                        <span className="flex items-center gap-1"><Shield size={10} /> {policy?.status}</span>
                                        <span className="flex items-center gap-1 font-mono">ID: {policy?.id.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isDraft && (
                        <Button
                            onClick={handleActivate}
                            size="sm"
                            className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-[11px] font-bold shadow-sm"
                        >
                            <CheckCircle2 size={14} />
                            Activate
                        </Button>
                    )}
                    {isActive && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => archivePolicy(id!)}
                            className="h-8 rounded-lg gap-2 text-[11px] font-bold text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        >
                            <Archive size={14} />
                            Archive
                        </Button>
                    )}
                    <button
                        onClick={async () => {
                            if (window.confirm('PERMANENTLY delete policy?')) {
                                await deletePolicy(id!);
                                navigate('/access-control/policies');
                            }
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)] gap-6">
                <button
                    onClick={() => setActiveTab('rules')}
                    className={cn(
                        "pb-3 text-xs font-bold uppercase tracking-wider transition-all relative",
                        activeTab === 'rules' ? "text-blue-500" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    )}
                >
                    <div className="flex items-center gap-2">
                        Rules <span className="text-[10px] opacity-70">({currentRules.length})</span>
                    </div>
                    {activeTab === 'rules' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('bindings')}
                    className={cn(
                        "pb-3 text-xs font-bold uppercase tracking-wider transition-all relative",
                        activeTab === 'bindings' ? "text-blue-500" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    )}
                >
                    <div className="flex items-center gap-2">
                        Bindings <span className="text-[10px] opacity-70">({currentBindings.length})</span>
                    </div>
                    {activeTab === 'bindings' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'rules' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted-foreground)]">Infrastructure Rules</h3>
                            {isDraft && (
                                <Button size="sm" variant="outline" className="h-8 rounded-lg gap-2 text-[10px] font-bold border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => setIsAddRuleModalOpen(true)}>
                                    <Plus size={14} />
                                    Add Rule
                                </Button>
                            )}
                        </div>

                        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--color-muted)]/30 border-b border-[var(--color-border)]">
                                        <th className="px-5 py-3 text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">Effect</th>
                                        <th className="px-5 py-3 text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider font-mono">Resource</th>
                                        <th className="px-5 py-3 text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider font-mono">Action</th>
                                        <th className="px-5 py-3 text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border)]">
                                    {currentRules.map((rule) => (
                                        <tr key={rule.id} className="hover:bg-[var(--color-muted)]/10 transition-colors group/r">
                                            <td className="px-5 py-3">
                                                <div className={cn(
                                                    "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase w-fit tracking-tighter border",
                                                    rule.effect === 'deny' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                )}>
                                                    {rule.effect}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs font-mono text-[var(--color-foreground)]">{rule.resource}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs font-mono text-[var(--color-foreground)]">{rule.action}</span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                {isDraft && (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Remove this rule?')) {
                                                                removeRule(id!, rule.id);
                                                            }
                                                        }}
                                                        className="p-1.5 text-[var(--color-muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover/r:opacity-100"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {currentRules.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-[var(--color-muted-foreground)] italic text-xs font-medium">
                                                No rules defined for this policy draft.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'bindings' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted-foreground)]">Subject Bindings</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Roles Binding */}
                            <div className="space-y-3">
                                <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">Roles Library</h4>
                                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm divide-y divide-[var(--color-border)]">
                                    {roles.map(role => {
                                        const isBound = currentBindings.some(b => b.subject_type === 'role' && b.subject_id === role.id);
                                        return (
                                            <div key={role.id} className="px-4 py-2.5 flex items-center justify-between group/b hover:bg-[var(--color-muted)]/5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold">{role.name}</span>
                                                    <span className="text-[9px] text-[var(--color-muted-foreground)] uppercase">Level {role.level}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const binding = currentBindings.find(b => b.subject_type === 'role' && b.subject_id === role.id);
                                                        if (binding) {
                                                            if (window.confirm('Remove binding?')) unbindSubject(id!, binding.id);
                                                        } else {
                                                            bindSubject(id!, 'role', role.id);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "text-[9px] font-bold px-2 py-1 rounded transition-all",
                                                        isBound ? "text-emerald-500 bg-emerald-50 border border-emerald-100" : "text-blue-600 hover:bg-blue-50 opacity-0 group-hover/b:opacity-100"
                                                    )}
                                                >
                                                    {isBound ? 'Bound' : 'Bind'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Users Binding */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">Subject Search</h4>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" size={10} />
                                        <input
                                            placeholder="User..."
                                            value={userSearchQuery}
                                            onChange={(e) => setUserSearchQuery(e.target.value)}
                                            className="pl-6 pr-3 py-1 bg-[var(--color-muted)]/30 border border-[var(--color-border)] rounded-lg text-[10px] w-32 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                                <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm divide-y divide-[var(--color-border)]">
                                    {users.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).slice(0, 8).map(u => {
                                        const isBound = currentBindings.some(b => b.subject_type === 'user' && b.subject_id === u.id);
                                        return (
                                            <div key={u.id} className="px-4 py-2.5 flex items-center justify-between group/b hover:bg-[var(--color-muted)]/5">
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-xs font-bold truncate">{u.username}</span>
                                                    <span className="text-[9px] text-[var(--color-muted-foreground)] truncate">{u.email}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const binding = currentBindings.find(b => b.subject_type === 'user' && b.subject_id === u.id);
                                                        if (binding) {
                                                            if (window.confirm('Remove binding?')) unbindSubject(id!, binding.id);
                                                        } else {
                                                            bindSubject(id!, 'user', u.id);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "text-[9px] font-bold px-2 py-1 rounded transition-all",
                                                        isBound ? "text-emerald-500 bg-emerald-50 border border-emerald-100" : "text-blue-600 hover:bg-blue-50 opacity-0 group-hover/b:opacity-100"
                                                    )}
                                                >
                                                    {isBound ? 'Bound' : 'Bind'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                    {users.length === 0 && (
                                        <div className="p-10 text-center text-[10px] text-[var(--color-muted-foreground)] uppercase tracking-widest font-black opacity-30">
                                            No Subjects Found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Rule Modal */}
            {
                isAddRuleModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
                        onClick={() => setIsAddRuleModalOpen(false)}
                    >
                        <div
                            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Infrastructure Rule</h2>
                                <button onClick={() => setIsAddRuleModalOpen(false)} className="p-1 hover:bg-[var(--color-muted)] rounded-lg text-[var(--color-muted-foreground)]">
                                    <X size={16} />
                                </button>
                            </div>
                            <form className="space-y-4" onSubmit={async (e) => {
                                e.preventDefault();
                                if (selectedResources.length === 0 || selectedActions.length === 0) {
                                    toast.error('Selection required');
                                    return;
                                }

                                const effect = new FormData(e.currentTarget).get('effect') as 'allow' | 'deny';

                                for (const resource of selectedResources) {
                                    for (const action of selectedActions) {
                                        await addRule(id!, {
                                            effect,
                                            resource,
                                            action,
                                        });
                                    }
                                }

                                setIsAddRuleModalOpen(false);
                                setSelectedResources([]);
                                setSelectedActions([]);
                            }}>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-[var(--color-muted-foreground)] tracking-wider">Effect</label>
                                    <select name="effect" className="w-full bg-[var(--color-muted)]/30 border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/20">
                                        <option value="allow">Allow</option>
                                        <option value="deny">Deny</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase text-[var(--color-muted-foreground)] tracking-wider">Resources</label>
                                    <div className="flex flex-wrap gap-1">
                                        {RESOURCE_OPTIONS.map(res => (
                                            <button
                                                key={res}
                                                type="button"
                                                onClick={() => setSelectedResources(prev =>
                                                    prev.includes(res) ? prev.filter(r => r !== res) : [...prev, res]
                                                )}
                                                className={cn(
                                                    "px-2 py-1 rounded-lg text-[10px] font-bold border transition-all",
                                                    selectedResources.includes(res)
                                                        ? "bg-blue-600 text-white border-transparent shadow-sm"
                                                        : "bg-[var(--color-background)] text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:border-blue-500/30"
                                                )}
                                            >
                                                {res}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase text-[var(--color-muted-foreground)] tracking-wider">Actions</label>
                                    <div className="flex flex-wrap gap-1">
                                        {ACTION_OPTIONS.map(act => (
                                            <button
                                                key={act}
                                                type="button"
                                                onClick={() => setSelectedActions(prev =>
                                                    prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]
                                                )}
                                                className={cn(
                                                    "px-2 py-1 rounded-lg text-[10px] font-bold border transition-all",
                                                    selectedActions.includes(act)
                                                        ? "bg-blue-600 text-white border-transparent shadow-sm"
                                                        : "bg-[var(--color-background)] text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:border-blue-500/30"
                                                )}
                                            >
                                                {act}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddRuleModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Create Rules</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default PolicyDetailPage;
