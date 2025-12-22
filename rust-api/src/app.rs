use axum::Router;
use tower_http::services::{ServeDir, ServeFile};

use crate::{
    routes::user_routes,
    state::app_state::AppState,
};

pub fn create_app(state: AppState) -> Router {
    let api_router = Router::new()
        .nest("/users", user_routes::routes());

    let frontend_dir = std::path::PathBuf::from("./dist");
    let static_service = ServeDir::new(&frontend_dir)
        .not_found_service(ServeFile::new(frontend_dir.join("index.html")));

    Router::new()
        .nest("/api", api_router)
        .fallback_service(static_service)
        .with_state(state)
}
