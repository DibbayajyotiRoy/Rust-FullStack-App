use sqlx::PgPool;
use uuid::Uuid;
use crate::models::user_role::{Policy, PolicyVersion, Role};

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
    let mut tx = pool.begin().await?;

    let policy = sqlx::query_as::<_, Policy>(
        r#"
        INSERT INTO policies (policy_number, name, description)
        VALUES ($1, $2, $3)
        RETURNING id, policy_number, name, description, is_archived, current_version, created_at, updated_at
        "#
    )
    .bind(policy_number)
    .bind(name)
    .bind(description)
    .fetch_one(&mut *tx)
    .await?;

    // Create initial version
    sqlx::query(
        r#"
        INSERT INTO policy_versions (policy_id, version, name, description)
        VALUES ($1, $2, $3, $4)
        "#
    )
    .bind(policy.id)
    .bind(1)
    .bind(name)
    .bind(description)
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(policy)
}

pub async fn update_policy(
    pool: &PgPool,
    id: Uuid,
    name: &str,
    description: Option<&str>,
) -> sqlx::Result<Policy> {
    let mut tx = pool.begin().await?;

    let current = sqlx::query_as::<_, Policy>(
        "SELECT * FROM policies WHERE id = $1 FOR UPDATE"
    )
    .bind(id)
    .fetch_one(&mut *tx)
    .await?;

    let next_version = current.current_version + 1;

    let updated = sqlx::query_as::<_, Policy>(
        r#"
        UPDATE policies
        SET name = $1, description = $2, current_version = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, policy_number, name, description, is_archived, current_version, created_at, updated_at
        "#
    )
    .bind(name)
    .bind(description)
    .bind(next_version)
    .bind(id)
    .fetch_one(&mut *tx)
    .await?;

    sqlx::query(
        r#"
        INSERT INTO policy_versions (policy_id, version, name, description)
        VALUES ($1, $2, $3, $4)
        "#
    )
    .bind(id)
    .bind(next_version)
    .bind(name)
    .bind(description)
    .execute(&mut *tx)
    .await?;

    tx.commit().await?;
    Ok(updated)
}

pub async fn archive_policy(pool: &PgPool, id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query(
        "UPDATE policies SET is_archived = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1"
    )
    .bind(id)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

pub async fn list_policies(pool: &PgPool) -> sqlx::Result<Vec<Policy>> {
    sqlx::query_as::<_, Policy>(
        "SELECT * FROM policies ORDER BY policy_number ASC"
    )
    .fetch_all(pool)
    .await
}

pub async fn get_policy_versions(pool: &PgPool, policy_id: Uuid) -> sqlx::Result<Vec<PolicyVersion>> {
    sqlx::query_as::<_, PolicyVersion>(
        "SELECT * FROM policy_versions WHERE policy_id = $1 ORDER BY version DESC"
    )
    .bind(policy_id)
    .fetch_all(pool)
    .await
}

// Role-Policy permissions
pub async fn assign_policy_to_role(pool: &PgPool, role_id: Uuid, policy_id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query(
        "INSERT INTO role_policy_permissions (role_id, policy_id) VALUES ($1, $2) ON CONFLICT DO NOTHING"
    )
    .bind(role_id)
    .bind(policy_id)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

pub async fn remove_policy_from_role(pool: &PgPool, role_id: Uuid, policy_id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query(
        "DELETE FROM role_policy_permissions WHERE role_id = $1 AND policy_id = $2"
    )
    .bind(role_id)
    .bind(policy_id)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

// Editor permissions
pub async fn set_policy_editor_level(pool: &PgPool, policy_id: Uuid, level: i32) -> sqlx::Result<u64> {
    let result = sqlx::query(
        "INSERT INTO policy_editor_permissions (policy_id, role_level) VALUES ($1, $2) ON CONFLICT DO NOTHING"
    )
    .bind(policy_id)
    .bind(level)
    .execute(pool)
    .await?;
    Ok(result.rows_affected())
}

pub async fn list_policies_for_role(pool: &PgPool, role_id: Uuid) -> sqlx::Result<Vec<Policy>> {
    sqlx::query_as::<_, Policy>(
        r#"
        SELECT p.* FROM policies p
        JOIN role_policy_permissions rpp ON p.id = rpp.policy_id
        WHERE rpp.role_id = $1
        "#
    )
    .bind(role_id)
    .fetch_all(pool)
    .await
}
