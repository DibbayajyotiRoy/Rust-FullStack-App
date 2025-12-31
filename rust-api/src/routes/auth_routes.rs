use axum::{
    routing::{get, post},
    Router,
};

use crate::{
    handlers::auth_handler,
    state::app_state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/login", post(auth_handler::login))
        .route("/logout", post(auth_handler::logout))
        .route("/me", get(auth_handler::me))
}
