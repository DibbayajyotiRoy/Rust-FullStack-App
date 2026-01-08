use sqlx::PgPool;
use uuid::Uuid;
use crate::models::user_role::{Policy, PolicyRule, PolicyBinding, PolicyStatus, Role};

// Roles
pub async fn list_roles(pool: &PgPool) -> sqlx::Result<Vec<Role>> {
    sqlx::query_as::<_, Role>(
        "SELECT id, name, level, description, created_at FROM roles ORDER BY level ASC"
    )
    .fetch_all(pool)
    .await
}

// Policies
pub async fn create_policy(
    pool: &PgPool,
    policy_number: i32,
    name: &str,
    description: Option<&str>,
) -> sqlx::Result<Policy> {
    sqlx::query_as::<_, Policy>(
        r#"
        INSERT INTO policies (policy_number, name, description, status)
        VALUES ($1, $2, $3, 'draft')
        RETURNING id, policy_number, name, description, status, is_archived, current_version, created_at, updated_at
        "#
    )
    .bind(policy_number)
    .bind(name)
    .bind(description)
    .fetch_one(pool)
    .await
}

pub async fn activate_policy(pool: &PgPool, id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query(
        "UPDATE policies SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 'draft'"
    )
    .bind(id)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

pub async fn archive_policy(pool: &PgPool, id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query(
        "UPDATE policies SET status = 'archived', is_archived = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1"
    )
    .bind(id)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

pub async fn list_policies(pool: &PgPool) -> sqlx::Result<Vec<Policy>> {
    sqlx::query_as::<_, Policy>(
        r#"
        SELECT p.*, 
               (SELECT COUNT(*) FROM policy_rules pr WHERE pr.policy_id = p.id AND pr.effect = 'allow') as allow_count,
               (SELECT COUNT(*) FROM policy_rules pr WHERE pr.policy_id = p.id AND pr.effect = 'deny') as deny_count
        FROM policies p 
        ORDER BY p.policy_number ASC
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn delete_policy(pool: &PgPool, id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query("DELETE FROM policies WHERE id = $1")
        .bind(id)
        .execute(pool)
        .await?;
    Ok(result.rows_affected())
}

// Rules
pub async fn add_policy_rule(
    pool: &PgPool,
    policy_id: Uuid,
    effect: &str,
    resource: &str,
    action: &str,
    conditions: Option<serde_json::Value>,
) -> sqlx::Result<PolicyRule> {
    // Note: Active policies should be immutable. We check this.
    let policy = sqlx::query_as::<_, Policy>("SELECT * FROM policies WHERE id = $1")
        .bind(policy_id)
        .fetch_one(pool)
        .await?;

    if policy.status != PolicyStatus::Draft.to_string() {
        return Err(sqlx::Error::Protocol("Cannot modify rules of a non-draft policy".into()));
    }

    sqlx::query_as::<_, PolicyRule>(
        r#"
        INSERT INTO policy_rules (policy_id, effect, resource, action, conditions)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, policy_id, effect, resource, action, conditions, created_at
        "#
    )
    .bind(policy_id)
    .bind(effect)
    .bind(resource)
    .bind(action)
    .bind(conditions)
    .fetch_one(pool)
    .await
}

pub async fn remove_policy_rule(pool: &PgPool, rule_id: Uuid) -> sqlx::Result<u64> {
    // Check if policy is draft
    let rule = sqlx::query_as::<_, PolicyRule>("SELECT * FROM policy_rules WHERE id = $1")
        .bind(rule_id)
        .fetch_one(pool)
        .await?;

    let policy = sqlx::query_as::<_, Policy>("SELECT * FROM policies WHERE id = $1")
        .bind(rule.policy_id)
        .fetch_one(pool)
        .await?;

    if policy.status != PolicyStatus::Draft.to_string() {
        return Err(sqlx::Error::Protocol("Cannot modify rules of a non-draft policy".into()));
    }

    let result = sqlx::query("DELETE FROM policy_rules WHERE id = $1")
        .bind(rule_id)
        .execute(pool)
        .await?;
    Ok(result.rows_affected())
}

pub async fn list_policy_rules(pool: &PgPool, policy_id: Uuid) -> sqlx::Result<Vec<PolicyRule>> {
    sqlx::query_as::<_, PolicyRule>(
        "SELECT * FROM policy_rules WHERE policy_id = $1"
    )
    .bind(policy_id)
    .fetch_all(pool)
    .await
}

pub async fn list_policy_bindings(pool: &PgPool, policy_id: Uuid) -> sqlx::Result<Vec<PolicyBinding>> {
    sqlx::query_as::<_, PolicyBinding>(
        "SELECT * FROM policy_bindings WHERE policy_id = $1"
    )
    .bind(policy_id)
    .fetch_all(pool)
    .await
}

// Bindings
pub async fn bind_policy(
    pool: &PgPool,
    policy_id: Uuid,
    subject_type: &str,
    subject_id: Uuid,
) -> sqlx::Result<PolicyBinding> {
    sqlx::query_as::<_, PolicyBinding>(
        r#"
        INSERT INTO policy_bindings (policy_id, subject_type, subject_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (policy_id, subject_type, subject_id) DO NOTHING
        RETURNING id, policy_id, subject_type, subject_id, created_at
        "#
    )
    .bind(policy_id)
    .bind(subject_type)
    .bind(subject_id)
    .fetch_one(pool)
    .await
}

pub async fn unbind_policy(pool: &PgPool, binding_id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query("DELETE FROM policy_bindings WHERE id = $1")
        .bind(binding_id)
        .execute(pool)
        .await?;
    Ok(result.rows_affected())
}

pub async fn list_bindings_for_subject(
    pool: &PgPool,
    subject_type: &str,
    subject_id: Uuid,
) -> sqlx::Result<Vec<PolicyBinding>> {
    sqlx::query_as::<_, PolicyBinding>(
        "SELECT * FROM policy_bindings WHERE subject_type = $1 AND subject_id = $2"
    )
    .bind(subject_type)
    .bind(subject_id)
    .fetch_all(pool)
    .await
}

pub async fn list_policies_for_subject(
    pool: &PgPool,
    subject_type: &str,
    subject_id: Uuid,
) -> sqlx::Result<Vec<Policy>> {
    sqlx::query_as::<_, Policy>(
        r#"
        SELECT p.* FROM policies p
        JOIN policy_bindings pb ON p.id = pb.policy_id
        WHERE pb.subject_type = $1 AND pb.subject_id = $2
        "#
    )
    .bind(subject_type)
    .bind(subject_id)
    .fetch_all(pool)
    .await
}
