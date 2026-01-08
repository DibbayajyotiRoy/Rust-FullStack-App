use axum::{
    routing::{get, post, delete},
    Router,
};

use crate::{
    handlers::policy_handler,
    state::app_state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/roles", get(policy_handler::list_roles))
        .route("/roles/{id}/policies", get(policy_handler::list_role_policies))
        .route("/users/{id}/policies", get(policy_handler::list_user_policies))
        .route("/policies", get(policy_handler::list_policies).post(policy_handler::create_policy))
        .route("/policies/{id}/activate", post(policy_handler::activate_policy))
        .route("/policies/{id}/archive", post(policy_handler::archive_policy))
        .route("/policies/{id}/rules", get(policy_handler::list_policy_rules).post(policy_handler::add_policy_rule))
        .route("/policies/{id}/bindings", get(policy_handler::list_policy_bindings))
        .route("/policies/{id}/bind", post(policy_handler::bind_policy))
        .route("/policies/{id}", delete(policy_handler::delete_policy))
        .route("/policies/rules/{id}", delete(policy_handler::remove_policy_rule))
        .route("/policies/bindings/{id}", delete(policy_handler::unbind_policy))
        .route("/simulate", post(policy_handler::simulate_auth))
}
