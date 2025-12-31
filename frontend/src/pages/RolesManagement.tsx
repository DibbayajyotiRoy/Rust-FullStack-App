import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth.context';
import type { Role, Policy, User } from '@/types/user';
import { Shield, Settings2, Plus, Users, ChevronDown, ChevronUp, User as UserIcon, LayoutGrid, List as ListIcon, MoreHorizontal } from 'lucide-react';
import { useRolesStore } from '@/stores/roles.store';
import { usePoliciesStore } from '@/stores/policies.store';
import { useUsersStore } from '@/stores/users.store';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Grid View Component (Role Card) ---
const RoleCard: React.FC<{ role: Role; policies: Policy[]; users: User[]; canManage: boolean }> = ({ role, policies, users, canManage }) => {
    const { rolePolicies, fetchRolePolicies, assignPolicy } = useRolesStore();
    const [expandedUsers, setExpandedUsers] = useState(false);

    const activePolicies = rolePolicies[role.id] || [];
    const isLoadingPolicies = !rolePolicies[role.id];

    useEffect(() => {
        fetchRolePolicies(role.id);
    }, [role.id]);

    const roleUsers = users.filter(u => u.role_id === role.id);

    return (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all group overflow-hidden relative flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Shield size={80} />
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                    <Shield size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[var(--color-foreground)]">{role.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Level {role.level}
                        </span>
                        <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                            • {roleUsers.length} Users
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-[var(--color-muted-foreground)] text-sm mb-6 line-clamp-2 min-h-[40px]">
                {role.description || 'No description provided for this role.'}
            </p>

            <div className="space-y-3 flex-1">
                <div className="text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider">
                    Active Policies
                </div>
                <div className="flex flex-wrap gap-2">
                    {activePolicies.length > 0 ? (
                        activePolicies.map(p => (
                            <span key={p.id} className="text-[10px] font-bold text-blue-500 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded-md">
                                {p.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-[var(--color-muted-foreground)] opacity-50">
                            {isLoadingPolicies ? 'Loading policies...' : 'No policies assigned'}
                        </span>
                    )}
                </div>
            </div>

            {/* Users Section */}
            <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                <button
                    onClick={() => setExpandedUsers(!expandedUsers)}
                    className="flex items-center justify-between w-full text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider hover:text-[var(--color-foreground)] transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Users size={14} />
                        Assigned Users ({roleUsers.length})
                    </div>
                    {expandedUsers ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedUsers && (
                    <div className="mt-3 space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                        {roleUsers.length > 0 ? (
                            roleUsers.map(u => (
                                <div key={u.id} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border)]/50">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                                        <UserIcon size={12} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium text-[var(--color-foreground)] truncate">{u.username}</span>
                                        <span className="text-[10px] text-[var(--color-muted-foreground)] truncate">{u.email}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-[var(--color-muted-foreground)] text-center py-2 italic">
                                No users assigned to this role
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex flex-col gap-4">
                {canManage && (
                    <div className="flex gap-2">
                        <select
                            className="flex-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-[var(--color-foreground)]"
                            onChange={(e) => {
                                if (e.target.value) {
                                    assignPolicy(role.id, e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        >
                            <option value="">+ Assign Policy...</option>
                            {policies
                                .filter(p => !activePolicies.some(rp => rp.id === p.id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))
                            }
                        </select>
                        <button className="p-1.5 hover:bg-[var(--color-secondary)] rounded-lg text-[var(--color-muted-foreground)] transition-colors" title="Settings">
                            <Settings2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- List View Component (Table) ---
const RolesTable: React.FC<{ roles: Role[]; users: User[], canManage: boolean }> = ({ roles, users, canManage }) => {
    return (
        <div className="border rounded-md">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Users</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Policies</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {roles.map((role) => {
                            const roleUsers = users.filter(u => u.role_id === role.id);
                            // Policies are loaded inside individual calls in Grid, here we might need a better strategy or load all?
                            // Ideally store should cache policies. For now, we omit policies column detail to save complexity/duplicate fetching logic or refactor store.
                            // Let's just show count for now.
                            return (
                                <tr key={role.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium flex items-center gap-2">
                                        <Shield size={16} className="text-blue-500" />
                                        {role.name}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            Level {role.level}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {roleUsers.length} Users
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground italic">
                                        {/* To show policies here we'd need to fetch them for every role which might be heavy in list view if not already cached. */}
                                        View in Grid
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => toast.info('View details feature coming soon')}>View Details</DropdownMenuItem>
                                                {canManage && <DropdownMenuItem onClick={() => toast.info('Edit feature coming soon')}>Edit Role</DropdownMenuItem>}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


const RolesManagement: React.FC = () => {
    const { user } = useAuth();
    const { roles, fetchRoles, isLoading: rolesLoading } = useRolesStore();
    const { policies, fetchPolicies } = usePoliciesStore();
    const { users, fetchUsers } = useUsersStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchRoles();
        fetchPolicies();
        fetchUsers();
    }, []);

    // Determine if current user can manage roles (e.g. Superadmin level 0)
    const canManageRoles = user?.role_id && roles?.find(r => r.id === user.role_id)?.level === 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Header - Standardized */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">
                        Role Hierarchy
                    </h1>
                    <p className="type-secondary">
                        Manage user levels, associated policies, and view assigned users
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg p-1 bg-[var(--color-card)]">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[var(--color-secondary)] text-[var(--color-foreground)] shadow-sm' : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[var(--color-secondary)] text-[var(--color-foreground)] shadow-sm' : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'}`}
                            title="List View"
                        >
                            <ListIcon size={16} />
                        </button>
                    </div>
                    {canManageRoles && (
                        <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => toast.info('Create Role feature coming soon')}
                        >
                            <Plus className="h-4 w-4" />
                            Create Role
                        </Button>
                    )}
                </div>
            </div>

            {rolesLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {roles.length > 0 ? roles.map((role) => (
                                <RoleCard
                                    key={role.id}
                                    role={role}
                                    policies={policies || []}
                                    users={users || []}
                                    canManage={!!canManageRoles}
                                />
                            )) : (
                                <p className="col-span-full text-center text-[var(--color-muted-foreground)]">No roles found.</p>
                            )}
                        </div>
                    ) : (
                        <RolesTable
                            roles={roles}
                            users={users || []}
                            canManage={!!canManageRoles}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default RolesManagement;
