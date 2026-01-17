use sqlx::PgPool;
use uuid::Uuid;

use crate::models::user::{User, UserWithRole, CreateUserPayload, UpdateUserPayload};

pub async fn create_user(
    pool: &PgPool,
    payload: CreateUserPayload,
) -> sqlx::Result<User> {
    sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING
            id,
            username,
            email,
            password_hash,
            role_id,
            created_at,
            updated_at
        "#
    )
    .bind(payload.username)
    .bind(payload.email)
    .bind(payload.password_hash)
    .fetch_one(pool)
    .await
}

pub async fn list_users(pool: &PgPool) -> sqlx::Result<Vec<UserWithRole>> {
    sqlx::query_as::<_, UserWithRole>(
        r#"
        SELECT
            u.id,
            u.username,
            u.email,
            u.password_hash,
            u.role_id,
            r.name as role_name,
            u.created_at,
            u.updated_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_user(pool: &PgPool, id: Uuid) -> sqlx::Result<User> {
    sqlx::query_as::<_, User>(
        r#"
        SELECT
            id,
            username,
            email,
            password_hash,
            role_id,
            created_at,
            updated_at
        FROM users
        WHERE id = $1
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn update_user(
    pool: &PgPool,
    id: Uuid,
    payload: UpdateUserPayload,
) -> sqlx::Result<User> {
    sqlx::query_as::<_, User>(
        r#"
        UPDATE users
        SET
            username = $1,
            email = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING
            id,
            username,
            email,
            password_hash,
            role_id,
            created_at,
            updated_at
        "#
    )
    .bind(payload.username)
    .bind(payload.email)
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn delete_user(pool: &PgPool, id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query(
        r#"
        DELETE FROM users
        WHERE id = $1
        "#
    )
    .bind(id)
    .execute(pool)
    .await?;

    Ok(result.rows_affected())
}
