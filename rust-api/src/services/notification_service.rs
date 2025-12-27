use crate::events::notification_event::NotificationEvent;
use crate::state::notification_hub::NotificationHub;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn create_notification(
    pool: &PgPool,
    hub: &NotificationHub,
    event_type: &str,
    message: &str,
    actor_id: Option<Uuid>,
) -> sqlx::Result<()> {
    let record = sqlx::query_as::<_, NotificationEvent>(
        r#"
        INSERT INTO notifications (event_type, message, actor_id)
        VALUES ($1, $2, $3)
        RETURNING id, event_type, message, created_at, is_read
        "#,
    )
    .bind(event_type)
    .bind(message)
    .bind(actor_id)
    .fetch_one(pool)
    .await?;

    // Real Time Push
    hub.publish(record);

    Ok(())
}

pub async fn get_recent_notifications(
    pool: &PgPool,
    limit: i64,
) -> sqlx::Result<Vec<NotificationEvent>> {
    sqlx::query_as::<_, NotificationEvent>(
        r#"
        SELECT id, event_type, message, created_at, is_read
        FROM notifications
        ORDER BY created_at DESC
        LIMIT $1
        "#,
    )
    .bind(limit)
    .fetch_all(pool)
    .await
}

pub async fn mark_as_read(pool: &PgPool, id: Uuid) -> sqlx::Result<()> {
    sqlx::query(
        "UPDATE notifications SET is_read = TRUE WHERE id = $1",
    )
    .bind(id)
    .execute(pool)
    .await?;
    Ok(())
}

pub async fn mark_all_as_read(pool: &PgPool) -> sqlx::Result<()> {
    sqlx::query("UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE")
        .execute(pool)
        .await?;
    Ok(())
}