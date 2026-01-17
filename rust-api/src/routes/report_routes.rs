use axum::{
    routing::{get, post},
    Router,
};

use crate::{
    handlers::report_handler,
    state::app_state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/",
            post(report_handler::create_report)
            .get(report_handler::list_my_reports),
        )
        .route("/all", get(report_handler::list_all_reports))
        .route(
            "/{id}",
            get(report_handler::get_report),
        )
        .route("/{id}/status", post(report_handler::update_report_status))
}
