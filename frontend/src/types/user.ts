export interface User {
    id: string;
    username: string;
    email: string;
    password_hash?: string;
    role_id?: string;
    created_at: string;
    updated_at: string;
}

export interface UserPayload {
    username: string;
    email: string;
    password_hash: string;
}

export interface Role {
    id: string;
    name: string;
    level: number;
    description?: string;
    created_at: string;
}

export const PolicyStatus = {
    Draft: 'draft',
    Active: 'active',
    Archived: 'archived'
} as const;

export type PolicyStatus = typeof PolicyStatus[keyof typeof PolicyStatus];

export interface PolicyRule {
    id: string;
    policy_id: string;
    effect: 'allow' | 'deny';
    resource: string;
    action: string;
    conditions?: any;
    created_at: string;
}

export interface PolicyBinding {
    id: string;
    policy_id: string;
    subject_type: 'role' | 'user';
    subject_id: string;
    created_at: string;
}

export interface AuthContext {
    department?: string;
    location?: string;
    time: string;
    resource_owner_id?: string;
}

export interface Decision {
    allowed: boolean;
    reason?: string;
    policy_id?: string;
}

export interface Policy {
    id: string;
    policy_number: number;
    name: string;
    description?: string;
    status: PolicyStatus;
    created_at: string;
    updated_at: string;
    allow_count: number;
    deny_count: number;
}

export interface PolicyVersion {
    id: string;
    policy_id: string;
    version: number;
    name: string;
    description?: string;
    created_at: string;
}
