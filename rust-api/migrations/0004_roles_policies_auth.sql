-- Migration: Roles, Policies, and Auth setup
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    level INTEGER NOT NULL, -- 0 is highest, NOT UNIQUE
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number INTEGER UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    current_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policy_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES policies(id),
    version INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_policy_permissions (
    role_id UUID NOT NULL REFERENCES roles(id),
    policy_id UUID NOT NULL REFERENCES policies(id),
    PRIMARY KEY (role_id, policy_id)
);

CREATE TABLE policy_editor_permissions (
    policy_id UUID NOT NULL REFERENCES policies(id),
    role_level INTEGER NOT NULL, -- level in roles
    PRIMARY KEY (policy_id, role_level)
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN role_id UUID REFERENCES roles(id);

-- SEED DATA
INSERT INTO roles (id, name, level, description) VALUES 
('00000000-0000-0000-0000-000000000000', 'Superadmin', 0, 'Full system access');

-- Admin user: username 'admin', email 'admin@ems.com', password '00'
INSERT INTO users (username, email, password_hash, role_id) VALUES 
('admin', 'admin@ems.com', '$2b$12$2wZve0F9AwxjqzBjkyg.rOYsr0k.eSP.4gk7UAnUIAlamB/9HYn.K', '00000000-0000-0000-0000-000000000000');
