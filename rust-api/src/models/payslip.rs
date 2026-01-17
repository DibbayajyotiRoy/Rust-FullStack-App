use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{NaiveDate, NaiveDateTime};

#[derive(Debug, Serialize, FromRow)]
pub struct Payslip {
    pub id: Uuid,
    pub user_id: Uuid,
    pub period_start: NaiveDate,
    pub period_end: NaiveDate,
    pub gross_salary: f64,
    pub deductions: f64,
    pub net_salary: f64,
    pub template_data: Option<serde_json::Value>,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, Deserialize)]
pub struct CreatePayslipPayload {
    pub user_id: Uuid,
    pub period_start: NaiveDate,
    pub period_end: NaiveDate,
    pub gross_salary: f64,
    pub deductions: f64,
    pub net_salary: f64,
    pub template_data: Option<serde_json::Value>,
}
