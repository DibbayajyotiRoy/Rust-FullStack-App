use sqlx::PgPool;
use uuid::Uuid;

use crate::models::payslip_template::{PayslipTemplate, CreatePayslipTemplatePayload, UpdatePayslipTemplatePayload};

pub async fn create_template(
    pool: &PgPool,
    created_by: Uuid,
    payload: CreatePayslipTemplatePayload,
) -> sqlx::Result<PayslipTemplate> {
    let id = Uuid::new_v4();
    sqlx::query_as::<_, PayslipTemplate>(
        r#"
        INSERT INTO payslip_templates (id, name, template_json, created_by, is_active)
        VALUES ($1, $2, $3, $4, false)
        RETURNING id, name, template_json, created_by, is_active, created_at, updated_at
        "#
    )
    .bind(id)
    .bind(&payload.name)
    .bind(&payload.template_json)
    .bind(created_by)
    .fetch_one(pool)
    .await
}

pub async fn list_templates(pool: &PgPool) -> sqlx::Result<Vec<PayslipTemplate>> {
    sqlx::query_as::<_, PayslipTemplate>(
        r#"
        SELECT id, name, template_json, created_by, is_active, created_at, updated_at
        FROM payslip_templates
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_template(pool: &PgPool, id: Uuid) -> sqlx::Result<PayslipTemplate> {
    sqlx::query_as::<_, PayslipTemplate>(
        r#"
        SELECT id, name, template_json, created_by, is_active, created_at, updated_at
        FROM payslip_templates
        WHERE id = $1
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn get_active_template(pool: &PgPool) -> sqlx::Result<Option<PayslipTemplate>> {
    sqlx::query_as::<_, PayslipTemplate>(
        r#"
        SELECT id, name, template_json, created_by, is_active, created_at, updated_at
        FROM payslip_templates
        WHERE is_active = true
        LIMIT 1
        "#
    )
    .fetch_optional(pool)
    .await
}

pub async fn update_template(
    pool: &PgPool,
    id: Uuid,
    payload: UpdatePayslipTemplatePayload,
) -> sqlx::Result<PayslipTemplate> {
    // Build dynamic update query
    let mut query = String::from("UPDATE payslip_templates SET updated_at = CURRENT_TIMESTAMP");
    
    if payload.name.is_some() {
        query.push_str(", name = $2");
    }
    if payload.template_json.is_some() {
        query.push_str(", template_json = $3");
    }
    if payload.is_active.is_some() {
        query.push_str(", is_active = $4");
    }
    
    query.push_str(" WHERE id = $1 RETURNING id, name, template_json, created_by, is_active, created_at, updated_at");
    
    sqlx::query_as::<_, PayslipTemplate>(&query)
        .bind(id)
        .bind(&payload.name)
        .bind(&payload.template_json)
        .bind(payload.is_active)
        .fetch_one(pool)
        .await
}

pub async fn set_active_template(pool: &PgPool, id: Uuid) -> sqlx::Result<PayslipTemplate> {
    // First deactivate all templates
    sqlx::query("UPDATE payslip_templates SET is_active = false")
        .execute(pool)
        .await?;
    
    // Then activate the specified one
    sqlx::query_as::<_, PayslipTemplate>(
        r#"
        UPDATE payslip_templates
        SET is_active = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, name, template_json, created_by, is_active, created_at, updated_at
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn delete_template(pool: &PgPool, id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query(r#"DELETE FROM payslip_templates WHERE id = $1"#)
        .bind(id)
        .execute(pool)
        .await?;
    Ok(result.rows_affected())
}
