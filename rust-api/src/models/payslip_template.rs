use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, FromRow)]
pub struct PayslipTemplate {
    pub id: Uuid,
    pub name: String,
    pub template_json: serde_json::Value,
    pub created_by: Option<Uuid>,
    pub is_active: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Deserialize)]
pub struct CreatePayslipTemplatePayload {
    pub name: String,
    pub template_json: serde_json::Value,
}

#[derive(Debug, Deserialize)]
pub struct UpdatePayslipTemplatePayload {
    pub name: Option<String>,
    pub template_json: Option<serde_json::Value>,
    pub is_active: Option<bool>,
}
