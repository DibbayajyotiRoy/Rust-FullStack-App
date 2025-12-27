use serde::Serialize;
use uuid::Uuid;
use sqlx::FromRow;

#[derive(Clone, Serialize, FromRow)]
pub struct NotificationEvent {
    pub id: Uuid,
    pub event_type: String,
    pub message: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}