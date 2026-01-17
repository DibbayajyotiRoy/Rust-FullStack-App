use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::NaiveDateTime;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type, PartialEq)]
#[sqlx(type_name = "VARCHAR")]
#[sqlx(rename_all = "PascalCase")]
pub enum ReportStatus {
    Submitted,
    Reviewed,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Report {
    pub id: Uuid,
    pub user_id: Uuid,
    pub title: String,
    pub content: String,
    pub attachment_path: Option<String>,
    pub status: String,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Deserialize)]
pub struct CreateReportPayload {
    pub title: String,
    pub content: String,
    pub attachment_path: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateReportStatusPayload {
    pub status: String,
}
