import React, { useEffect, useState } from 'react';
import type { Role, User } from '@/types/user';
import { Shield, Users, User as UserIcon, LayoutGrid, List as ListIcon, Info, ArrowRight, ExternalLink } from 'lucide-react';
import { useRolesStore } from '@/stores/roles.store';
import { usePoliciesStore } from '@/stores/policies.store';
import { useUsersStore } from '@/stores/users.store';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const RoleCard: React.FC<{ role: Role; users: User[] }> = ({ role, users }) => {
    const navigate = useNavigate();
    const { rolePolicies, fetchRolePolicies } = useRolesStore();
    const [expandedUsers, setExpandedUsers] = useState(false);

    const activePolicies = rolePolicies[role.id] || [];
    const isLoadingPolicies = !rolePolicies[role.id];

    useEffect(() => {
        fetchRolePolicies(role.id);
    }, [role.id]);

    const roleUsers = users.filter(u => u.role_id === role.id);

    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 hover:shadow-lg transition-all flex flex-col h-full relative group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                        <Shield size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-[var(--color-foreground)]">{role.name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10 uppercase tracking-tight">
                                Level {role.level}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-[var(--color-muted-foreground)] text-[11px] mb-4 leading-relaxed line-clamp-2">
                {role.description || 'Organizational role for grouping subjects.'}
            </p>

            <div className="space-y-3 flex-1">
                <div className="text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider flex items-center gap-2">
                    Active Policies
                </div>
                <div className="flex flex-col gap-1.5">
                    {activePolicies.length > 0 ? (
                        activePolicies.map(p => (
                            <button
                                key={p.id}
                                onClick={() => navigate(`/access-control/policies/${p.id}`)}
                                className="flex items-center justify-between w-full text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group/p"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    {p.name}
                                </div>
                                <ArrowRight size={10} className="opacity-0 group-hover/p:opacity-100 transition-opacity" />
                            </button>
                        ))
                    ) : (
                        <div className="text-[9px] text-[var(--color-muted-foreground)] bg-[var(--color-muted)]/20 p-3 rounded-lg text-center border border-dashed border-[var(--color-border)]">
                            {isLoadingPolicies ? 'Querying...' : 'No policies bound'}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                <button
                    onClick={() => setExpandedUsers(!expandedUsers)}
                    className="flex items-center justify-between w-full text-[9px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider hover:text-[var(--color-foreground)]"
                >
                    <div className="flex items-center gap-1.5 text-indigo-600">
                        <Users size={12} />
                        Subjects ({roleUsers.length})
                    </div>
                </button>

                {expandedUsers && (
                    <div className="mt-3 space-y-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar animate-in slide-in-from-top-1 duration-200">
                        {roleUsers.length > 0 ? (
                            roleUsers.map(u => (
                                <div key={u.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                        <UserIcon size={12} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-[var(--color-foreground)] text-[10px] truncate">{u.username}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-[10px] text-[var(--color-muted-foreground)] text-center py-2 italic">
                                No users assigned.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const RolesManagement: React.FC = () => {
    const { roles, fetchRoles, isLoading: rolesLoading } = useRolesStore();
    const { fetchPolicies } = usePoliciesStore();
    const { users, fetchUsers } = useUsersStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        fetchRoles();
        fetchPolicies();
        fetchUsers();
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">Roles & Groups</h1>
                    <div className="relative">
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            title="Click to view details"
                            className={cn(
                                "p-1 rounded-md transition-colors",
                                showInfo ? "bg-blue-50 text-blue-600" : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                            )}
                        >
                            <Info size={16} />
                        </button>
                        {showInfo && (
                            <div className="absolute top-full left-0 mt-2 w-80 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl z-50 animate-in slide-in-from-top-1 duration-200">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2">Passive Subject Model</h3>
                                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-3">
                                    Roles act as grouping tags. Permissions are NOT granted by roles, but by <strong>Policies</strong> bound to these roles.
                                </p>
                                <button
                                    onClick={() => window.location.href = '/access-control/policies'}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Manage Governance Policies <ExternalLink size={10} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[var(--color-border)] rounded-lg p-0.5 bg-[var(--color-muted)]/30">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'grid' ? "bg-white dark:bg-[var(--color-card)] shadow-sm text-blue-600 dark:text-blue-400" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                            )}
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'list' ? "bg-white dark:bg-[var(--color-card)] shadow-sm text-blue-600 dark:text-blue-400" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                            )}
                        >
                            <ListIcon size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {rolesLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {roles.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            users={users || []}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RolesManagement;
