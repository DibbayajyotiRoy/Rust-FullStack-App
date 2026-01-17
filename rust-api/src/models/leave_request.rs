use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{NaiveDate, NaiveDateTime};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type, PartialEq)]
#[sqlx(type_name = "VARCHAR")]
#[sqlx(rename_all = "PascalCase")]
pub enum LeaveType {
    Casual,
    Sick,
    Unpaid,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type, PartialEq)]
#[sqlx(type_name = "VARCHAR")]
#[sqlx(rename_all = "PascalCase")]
pub enum LeaveStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(Debug, Serialize, FromRow)]
pub struct LeaveRequest {
    pub id: Uuid,
    pub user_id: Uuid,
    pub leave_type: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub reason: String,
    pub status: String,
    pub approved_by: Option<Uuid>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Serialize, FromRow)]
pub struct LeaveRequestWithUser {
    pub id: Uuid,
    pub user_id: Uuid,
    pub username: String,
    pub email: String,
    pub leave_type: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub reason: String,
    pub status: String,
    pub approved_by: Option<Uuid>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Deserialize)]
pub struct CreateLeaveRequestPayload {
    pub leave_type: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub reason: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateLeaveStatusPayload {
    pub status: String,
}

#[derive(Debug, Serialize, FromRow)]
pub struct LeaveRequestWithApprover {
    pub id: Uuid,
    pub user_id: Uuid,
    pub leave_type: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub reason: String,
    pub status: String,
    pub approved_by: Option<Uuid>,
    pub approver_name: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
