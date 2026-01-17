use axum::{Router,routing::get, http::{Method, HeaderValue}};
use tower_http::{
    services::{ServeDir, ServeFile},
    cors::{CorsLayer, Any},
};


use crate::{
    routes::user_routes,
    state::app_state::AppState,
    handlers::ws_notifications::ws_notifications,
};

pub fn create_app(state: AppState) -> Router {
    let api_router = Router::new()
        .nest("/users", user_routes::routes())
        .nest("/auth", crate::routes::auth_routes::routes())
        .nest("/management", crate::routes::policy_routes::routes())
        .nest("/notifications", crate::routes::notification_routes::routes())
        // Employee self-service routes
        .nest("/leave-requests", crate::routes::leave_routes::routes())
        .nest("/reports", crate::routes::report_routes::routes())
        .nest("/payslips", crate::routes::payslip_routes::routes())
        // Admin routes (payslip templates)
        .nest("/admin/payslip-templates", crate::routes::template_routes::routes());

    // CORS configuration
    let cors = if let Ok(origins_str) = std::env::var("CORS_ALLOWED_ORIGINS") {
        let origins: Vec<HeaderValue> = origins_str
            .split(',')
            .map(|s| s.trim().parse().expect("Invalid CORS origin"))
            .collect();

        CorsLayer::new()
            .allow_origin(origins)
            .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
            .allow_headers([axum::http::header::CONTENT_TYPE, axum::http::header::AUTHORIZATION, axum::http::header::ACCEPT])
            .allow_credentials(true)
    } else {
        CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(Any)
            .allow_headers(Any)
            // Cannot use allow_credentials(true) with wildcard origin
            .allow_credentials(false)
    };

    let frontend_dir = std::path::PathBuf::from("./dist");
    let static_service = ServeDir::new(&frontend_dir)
        .not_found_service(ServeFile::new(frontend_dir.join("index.html")));

    Router::new()
         .route("/ws/notifications", get(ws_notifications))
        .nest("/api", api_router)
        .fallback_service(static_service)
        .layer(cors)
        .with_state(state)
}
