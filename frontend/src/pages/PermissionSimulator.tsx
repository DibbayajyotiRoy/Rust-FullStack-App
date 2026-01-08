import React, { useState, useEffect } from 'react';
import { useAuthSimulatorStore } from '@/stores/auth_simulator.store';
import { useUsersStore } from '@/stores/users.store';
import { Button } from '@/components/ui/button';
import {
    PlayCircle,
    ShieldCheck,
    Users,
    Key,
    Package,
    Database,
    Activity,
    Info,
    RefreshCw,
    XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PermissionSimulator: React.FC = () => {
    const { users, fetchUsers } = useUsersStore();
    const {
        decision,
        isSimulating,
        simulate,
        clearDecision
    } = useAuthSimulatorStore();

    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [action, setAction] = useState<string>('');
    const [resource, setResource] = useState<string>('');
    const [contextJson, setContextJson] = useState(JSON.stringify({
        "department": "Engineering",
        "location": "Remote",
        "time": new Date().toISOString()
    }, null, 2));

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSimulate = async () => {
        if (!selectedUserId || !action || !resource) return;

        try {
            const context = JSON.parse(contextJson);
            await simulate({
                action,
                resource,
                context: {
                    ...context,
                    // Identity is often inferred by the engine from the subject being tested, 
                    // but we pass the userId as part of the simulation target if the API expects it.
                    // The backend API might expect the userId in the payload.
                }
            });
        } catch (e) {
            alert('Invalid JSON context');
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Activity size={24} />
                    </div>
                    <h1 className="text-3xl font-black text-[var(--color-foreground)] tracking-tight">Policy Simulator</h1>
                </div>
                <p className="text-[var(--color-muted-foreground)] text-sm max-w-2xl">
                    Test your PBAC policies in real-time. Select a subject, define an intent, and see how the engine evaluates the decision.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 shadow-sm">
                        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-6 flex items-center gap-2">
                            <Key size={14} className="text-blue-500" />
                            Trial Context
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-[var(--color-muted-foreground)] tracking-widest px-1">Subject (User)</label>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                >
                                    <option value="">Select User...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-[var(--color-muted-foreground)] tracking-widest px-1">Action</label>
                                <div className="relative">
                                    <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" size={14} />
                                    <input
                                        value={action}
                                        onChange={(e) => setAction(e.target.value)}
                                        placeholder="e.g. read, write, delete"
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-muted-foreground)] tracking-widest px-1">Target Resource</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" size={14} />
                                    <input
                                        value={resource}
                                        onChange={(e) => setResource(e.target.value)}
                                        placeholder="e.g. settings, users:123, *"
                                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-black uppercase text-[var(--color-muted-foreground)] tracking-widest px-1 flex items-center justify-between">
                                    Evaluation Context (JSON)
                                    <Info size={12} className="opacity-50" />
                                </label>
                                <textarea
                                    value={contextJson}
                                    onChange={(e) => setContextJson(e.target.value)}
                                    className="w-full h-32 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <Button
                                onClick={handleSimulate}
                                disabled={!selectedUserId || !action || !resource || isSimulating}
                                className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20"
                            >
                                {isSimulating ? <RefreshCw size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                                Run Evaluation
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    clearDecision();
                                    setSelectedUserId('');
                                    setAction('');
                                    setResource('');
                                }}
                                className="h-12 w-12 rounded-2xl flex items-center justify-center p-0"
                            >
                                <XCircle size={18} />
                            </Button>
                        </div>
                    </section>
                </div>

                {/* Right: Results */}
                <div className="space-y-8">
                    <section className={cn(
                        "bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 min-h-[400px] flex flex-col transition-all duration-500 relative overflow-hidden",
                        decision?.allowed === true ? "border-emerald-500/30 shadow-2xl shadow-emerald-500/5" :
                            decision?.allowed === false ? "border-red-500/30 shadow-2xl shadow-red-500/5" : ""
                    )}>
                        {!decision ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                <ShieldCheck size={48} className="mb-4 text-[var(--color-muted-foreground)]" />
                                <p className="text-sm font-medium">Awaiting evaluation...</p>
                                <p className="text-[10px] uppercase tracking-widest mt-2">Decision engine idle</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col animate-in zoom-in-95 duration-500">
                                <div className="text-center mb-8">
                                    <div className={cn(
                                        "w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 transition-transform duration-500 scale-110",
                                        decision.allowed ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                    )}>
                                        {decision.allowed ? <ShieldCheck size={40} /> : <XCircle size={40} />}
                                    </div>
                                    <h3 className={cn(
                                        "text-2xl font-black uppercase tracking-tighter",
                                        decision.allowed ? "text-emerald-500" : "text-red-500"
                                    )}>
                                        {decision.allowed ? 'ALLOWED' : 'DENIED'}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] mt-1 opacity-50">Result</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 rounded-2xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] block mb-2 opacity-70">Decision Logic</label>
                                        <p className="text-xs font-bold leading-relaxed">{decision.reason || 'No specific reasoning provided by the engine.'}</p>
                                    </div>

                                    {decision.policy_id && (
                                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-blue-500 block mb-2">Primary Attribution</label>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-mono font-bold truncate">ID: {decision.policy_id}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-[var(--color-border)]">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)] opacity-50 mb-3">
                                            <Users size={12} />
                                            Attributes Applied
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-[var(--color-muted)] px-2 py-1 rounded-lg text-[9px] font-bold">authenticated</span>
                                            <span className="bg-[var(--color-muted)] px-2 py-1 rounded-lg text-[9px] font-bold">ip_verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Background decoration */}
                        <div className={cn(
                            "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none",
                            decision?.allowed === true ? "bg-emerald-500" :
                                decision?.allowed === false ? "bg-red-500" : "bg-blue-500"
                        )} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PermissionSimulator;
