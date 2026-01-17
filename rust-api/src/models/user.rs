use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::NaiveDateTime;

#[derive(Deserialize)]
pub struct CreateUserPayload {
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(Serialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub role_id: Option<Uuid>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

/// User with role name resolved from join
#[derive(Serialize, FromRow)]
pub struct UserWithRole {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub role_id: Option<Uuid>,
    pub role_name: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Deserialize)]
pub struct UpdateUserPayload {
    pub username: String,
    pub email: String,
}

#[derive(Deserialize)]
pub struct LoginPayload {
    pub identity: String, // username or email
    pub password: String,
}
