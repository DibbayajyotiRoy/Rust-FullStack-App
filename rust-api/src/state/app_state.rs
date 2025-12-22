use sqlx::PgPool;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}

impl AppState {
    pub async fn new() -> Self {
        let db = crate::db::pool::create_pool().await;
        Self { db }
    }
}
