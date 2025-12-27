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
        RETURNING id, event_type, message, created_at
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
        SELECT id, event_type, message, created_at
        FROM notifications
        ORDER BY created_at DESC
        LIMIT $1
        "#,
    )
    .bind(limit)
    .fetch_all(pool)
    .await
}