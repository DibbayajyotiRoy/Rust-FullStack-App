-- Migration: PBAC Overhaul

-- 1. Introduce policy rules
CREATE TABLE IF NOT EXISTS policy_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    effect VARCHAR(10) NOT NULL CHECK (effect IN ('allow', 'deny')),
    resource VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    conditions JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Introduce policy bindings (replacing role_policy_permissions conceptually)
CREATE TABLE IF NOT EXISTS policy_bindings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    subject_type VARCHAR(20) NOT NULL CHECK (subject_type IN ('role', 'user')),
    subject_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Update policies table with status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='policies' AND column_name='status') THEN
        ALTER TABLE policies ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived'));
    END IF;
END $$;

-- 4. Move data from old role_policy_permissions to policy_bindings (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'role_policy_permissions') THEN
        INSERT INTO policy_bindings (policy_id, subject_type, subject_id)
        SELECT policy_id, 'role', role_id FROM role_policy_permissions
        ON CONFLICT DO NOTHING;
        
        -- 5. Drop old table
        DROP TABLE role_policy_permissions;
    END IF;
END $$;

-- 6. Add policy rules for existing policies (as a baseline)
DO $$
DECLARE
    superadmin_policy_id UUID;
BEGIN
    SELECT id INTO superadmin_policy_id FROM policies WHERE policy_number = 1;
    IF superadmin_policy_id IS NOT NULL THEN
        -- Only insert if no rules exist for this policy to avoid duplicates
        IF NOT EXISTS (SELECT 1 FROM policy_rules WHERE policy_id = superadmin_policy_id) THEN
            INSERT INTO policy_rules (policy_id, effect, resource, action)
            VALUES (superadmin_policy_id, 'allow', '*', '*');
            
            UPDATE policies SET status = 'active' WHERE id = superadmin_policy_id;
        END IF;
    END IF;
END $$;
