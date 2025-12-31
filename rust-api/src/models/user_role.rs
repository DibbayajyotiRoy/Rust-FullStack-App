use serde::Serialize;
use sqlx::FromRow;
use uuid::Uuid;
use chrono::NaiveDateTime;

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct Role {
    pub id: Uuid,
    pub name: String,
    pub level: i32,
    pub description: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct Policy {
    pub id: Uuid,
    pub policy_number: i32,
    pub name: String,
    pub description: Option<String>,
    pub is_archived: bool,
    pub current_version: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct PolicyVersion {
    pub id: Uuid,
    pub policy_id: Uuid,
    pub version: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: NaiveDateTime,
}

#[derive(Serialize, FromRow, Clone, Debug)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token: String,
    pub expires_at: NaiveDateTime,
    pub created_at: NaiveDateTime,
}
