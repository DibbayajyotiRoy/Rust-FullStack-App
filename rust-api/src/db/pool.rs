use sqlx::{PgPool, postgres::PgPoolOptions};
use std::env;

pub async fn create_pool() -> PgPool {
    let url = env::var("DATABASE_URL")
        .expect("DATABASE_URL not set");

    PgPoolOptions::new()
        .max_connections(10)
        .connect(&url)
        .await
        .expect("DB connection failed")
}
