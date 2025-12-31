use axum::{
    routing::{get, post, put},
    Router,
};

use crate::{
    handlers::policy_handler,
    state::app_state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/roles", get(policy_handler::list_roles))
        .route("/roles/{id}/policies", get(policy_handler::list_policies_for_role))
        .route("/policies", get(policy_handler::list_policies).post(policy_handler::create_policy))
        .route("/policies/{id}", put(policy_handler::update_policy).delete(policy_handler::archive_policy))
        .route("/policies/{id}/versions", get(policy_handler::get_policy_versions))
        .route("/policies/{id}/assign", post(policy_handler::assign_policy_to_role))
        .route("/policies/{id}/editor-level", post(policy_handler::set_policy_editor_level))
}
