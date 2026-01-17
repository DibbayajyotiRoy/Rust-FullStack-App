use sqlx::PgPool;
use uuid::Uuid;

use crate::models::report::{Report, CreateReportPayload};

pub async fn create_report(
    pool: &PgPool,
    user_id: Uuid,
    payload: CreateReportPayload,
) -> sqlx::Result<Report> {
    let id = Uuid::new_v4();
    sqlx::query_as::<_, Report>(
        r#"
        INSERT INTO reports (id, user_id, title, content, attachment_path, status)
        VALUES ($1, $2, $3, $4, $5, 'Submitted')
        RETURNING id, user_id, title, content, attachment_path, status, created_at
        "#
    )
    .bind(id)
    .bind(user_id)
    .bind(&payload.title)
    .bind(&payload.content)
    .bind(&payload.attachment_path)
    .fetch_one(pool)
    .await
}

pub async fn list_reports_for_user(
    pool: &PgPool,
    user_id: Uuid,
) -> sqlx::Result<Vec<Report>> {
    sqlx::query_as::<_, Report>(
        r#"
        SELECT id, user_id, title, content, attachment_path, status, created_at
        FROM reports
        WHERE user_id = $1
        ORDER BY created_at DESC
        "#
    )
    .bind(user_id)
    .fetch_all(pool)
    .await
}

pub async fn list_all_reports(pool: &PgPool) -> sqlx::Result<Vec<Report>> {
    sqlx::query_as::<_, Report>(
        r#"
        SELECT id, user_id, title, content, attachment_path, status, created_at
        FROM reports
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_report(pool: &PgPool, id: Uuid) -> sqlx::Result<Report> {
    sqlx::query_as::<_, Report>(
        r#"
        SELECT id, user_id, title, content, attachment_path, status, created_at
        FROM reports
        WHERE id = $1
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn update_report_status(
    pool: &PgPool,
    id: Uuid,
    status: &str,
) -> sqlx::Result<Report> {
    sqlx::query_as::<_, Report>(
        r#"
        UPDATE reports
        SET status = $1
        WHERE id = $2
        RETURNING id, user_id, title, content, attachment_path, status, created_at
        "#
    )
    .bind(status)
    .bind(id)
    .fetch_one(pool)
    .await
}
