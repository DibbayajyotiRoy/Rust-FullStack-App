use sqlx::PgPool;
use uuid::Uuid;

use crate::models::payslip::{Payslip, CreatePayslipPayload};

pub async fn create_payslip(
    pool: &PgPool,
    payload: CreatePayslipPayload,
) -> sqlx::Result<Payslip> {
    let id = Uuid::new_v4();
    sqlx::query_as::<_, Payslip>(
        r#"
        INSERT INTO payslips (id, user_id, period_start, period_end, gross_salary, deductions, net_salary, template_data)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, user_id, period_start, period_end, gross_salary, deductions, net_salary, template_data, created_at
        "#
    )
    .bind(id)
    .bind(payload.user_id)
    .bind(payload.period_start)
    .bind(payload.period_end)
    .bind(payload.gross_salary)
    .bind(payload.deductions)
    .bind(payload.net_salary)
    .bind(&payload.template_data)
    .fetch_one(pool)
    .await
}

pub async fn list_payslips_for_user(
    pool: &PgPool,
    user_id: Uuid,
) -> sqlx::Result<Vec<Payslip>> {
    sqlx::query_as::<_, Payslip>(
        r#"
        SELECT id, user_id, period_start, period_end, gross_salary, deductions, net_salary, template_data, created_at
        FROM payslips
        WHERE user_id = $1
        ORDER BY period_start DESC
        "#
    )
    .bind(user_id)
    .fetch_all(pool)
    .await
}

pub async fn get_payslip(pool: &PgPool, id: Uuid) -> sqlx::Result<Payslip> {
    sqlx::query_as::<_, Payslip>(
        r#"
        SELECT id, user_id, period_start, period_end, gross_salary, deductions, net_salary, template_data, created_at
        FROM payslips
        WHERE id = $1
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
}
