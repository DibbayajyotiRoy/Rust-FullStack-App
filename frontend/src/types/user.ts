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

export interface Policy {
    id: string;
    policy_number: number;
    name: string;
    description?: string;
    is_archived: boolean;
    current_version: number;
    created_at: string;
    updated_at: string;
}

export interface PolicyVersion {
    id: string;
    policy_id: string;
    version: number;
    name: string;
    description?: string;
    created_at: string;
}
