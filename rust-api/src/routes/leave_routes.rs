use axum::{
    routing::{get, post},
    Router,
};

use crate::{
    handlers::leave_handler,
    state::app_state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/",
            post(leave_handler::create_leave_request)
            .get(leave_handler::list_my_leave_requests),
        )
        .route("/all", get(leave_handler::list_all_leave_requests))
        .route(
            "/{id}",
            get(leave_handler::get_leave_request)
                .delete(leave_handler::delete_leave_request),
        )
        .route("/{id}/status", post(leave_handler::update_leave_status))
}
