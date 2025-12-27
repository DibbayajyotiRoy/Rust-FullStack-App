use sqlx::PgPool;
use crate::state::notification_hub::NotificationHub;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub notifications: NotificationHub,
}

impl AppState {
    pub async fn new() -> Self {
        let db = crate::db::pool::create_pool().await;
        
        // Run migrations
        sqlx::migrate!()
            .run(&db)
            .await
            .expect("Failed to run migrations");

        let notifications = NotificationHub::new();
        Self { db, notifications }
    }
}
