use axum::{
    routing::{get, post},
    Router,
};

use crate::{
    handlers::template_handler,
    state::app_state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/",
            post(template_handler::create_template)
            .get(template_handler::list_templates),
        )
        .route(
            "/{id}",
            get(template_handler::get_template)
                .put(template_handler::update_template)
                .delete(template_handler::delete_template),
        )
        .route("/{id}/activate", post(template_handler::set_active_template))
}
