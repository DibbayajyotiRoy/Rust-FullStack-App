use axum::{
    routing::{post},
    Router,
};

use crate::handlers::notification_handler;
use crate::state::app_state::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/read-all", post(notification_handler::mark_all_read))
        .route("/{id}/read", post(notification_handler::mark_read))
}
