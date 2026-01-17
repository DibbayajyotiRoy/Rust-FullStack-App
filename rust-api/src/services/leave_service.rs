use sqlx::PgPool;
use uuid::Uuid;

use crate::models::leave_request::{LeaveRequest, CreateLeaveRequestPayload};

pub async fn create_leave_request(
    pool: &PgPool,
    user_id: Uuid,
    payload: CreateLeaveRequestPayload,
) -> sqlx::Result<LeaveRequest> {
    let id = Uuid::new_v4();
    sqlx::query_as::<_, LeaveRequest>(
        r#"
        INSERT INTO leave_requests (id, user_id, leave_type, start_date, end_date, reason, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
        RETURNING id, user_id, leave_type, start_date, end_date, reason, status, approved_by, created_at, updated_at
        "#
    )
    .bind(id)
    .bind(user_id)
    .bind(&payload.leave_type)
    .bind(payload.start_date)
    .bind(payload.end_date)
    .bind(&payload.reason)
    .fetch_one(pool)
    .await
}

pub async fn list_leave_requests_for_user(
    pool: &PgPool,
    user_id: Uuid,
) -> sqlx::Result<Vec<LeaveRequest>> {
    sqlx::query_as::<_, LeaveRequest>(
        r#"
        SELECT id, user_id, leave_type, start_date, end_date, reason, status, approved_by, created_at, updated_at
        FROM leave_requests
        WHERE user_id = $1
        ORDER BY created_at DESC
        "#
    )
    .bind(user_id)
    .fetch_all(pool)
    .await
}

pub async fn list_all_leave_requests(pool: &PgPool) -> sqlx::Result<Vec<LeaveRequest>> {
    sqlx::query_as::<_, LeaveRequest>(
        r#"
        SELECT id, user_id, leave_type, start_date, end_date, reason, status, approved_by, created_at, updated_at
        FROM leave_requests
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await
}

pub async fn get_leave_request(pool: &PgPool, id: Uuid) -> sqlx::Result<LeaveRequest> {
    sqlx::query_as::<_, LeaveRequest>(
        r#"
        SELECT id, user_id, leave_type, start_date, end_date, reason, status, approved_by, created_at, updated_at
        FROM leave_requests
        WHERE id = $1
        "#
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn update_leave_status(
    pool: &PgPool,
    id: Uuid,
    status: &str,
    approved_by: Uuid,
) -> sqlx::Result<LeaveRequest> {
    sqlx::query_as::<_, LeaveRequest>(
        r#"
        UPDATE leave_requests
        SET status = $1, approved_by = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, user_id, leave_type, start_date, end_date, reason, status, approved_by, created_at, updated_at
        "#
    )
    .bind(status)
    .bind(approved_by)
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn delete_leave_request(pool: &PgPool, id: Uuid) -> sqlx::Result<u64> {
    let result = sqlx::query(r#"DELETE FROM leave_requests WHERE id = $1"#)
        .bind(id)
        .execute(pool)
        .await?;
    Ok(result.rows_affected())
}
