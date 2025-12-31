use sqlx::PgPool;
use uuid::Uuid;
use chrono::{Utc, Duration};
use crate::models::user::User;
use crate::models::user_role::Session;
use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;

pub async fn find_user_by_identify(pool: &PgPool, identity: &str) -> sqlx::Result<Option<User>> {
    sqlx::query_as::<_, User>(
        r#"
        SELECT id, username, email, password_hash, role_id, created_at, updated_at
        FROM users
        WHERE username = $1 OR email = $1
        "#
    )
    .bind(identity)
    .fetch_optional(pool)
    .await
}

pub async fn create_session(pool: &PgPool, user_id: Uuid) -> sqlx::Result<Session> {
    let token: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(64)
        .map(char::from)
        .collect();

    let expires_at = Utc::now().naive_utc() + Duration::days(7);

    sqlx::query_as::<_, Session>(
        r#"
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, token, expires_at, created_at
        "#
    )
    .bind(user_id)
    .bind(token)
    .bind(expires_at)
    .fetch_one(pool)
    .await
}

pub async fn validate_session(pool: &PgPool, token: &str) -> sqlx::Result<Option<Session>> {
    sqlx::query_as::<_, Session>(
        r#"
        SELECT id, user_id, token, expires_at, created_at
        FROM sessions
        WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP
        "#
    )
    .bind(token)
    .fetch_optional(pool)
    .await
}

pub async fn delete_session(pool: &PgPool, token: &str) -> sqlx::Result<u64> {
    let result = sqlx::query(
        r#"
        DELETE FROM sessions
        WHERE token = $1
        "#
    )
    .bind(token)
    .execute(pool)
    .await?;

    Ok(result.rows_affected())
}
