use axum::{
    extract::{Path, State},
    http::StatusCode,
    http::HeaderMap,
    Json,
};
use uuid::Uuid;
use serde::Deserialize;
use serde_json::json;

use crate::{
    models::user_role::{Policy, PolicyRule, PolicyBinding, AuthContext},
    services::policy_service,
    services::auth_service,
    state::app_state::AppState,
    utils::auth::authorize_action,
};

#[derive(Deserialize)]
pub struct CreatePolicyPayload {
    pub policy_number: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct AddRulePayload {
    pub effect: String,
    pub resource: String,
    pub action: String,
    pub conditions: Option<serde_json::Value>,
}

#[derive(Deserialize)]
pub struct BindPolicyPayload {
    pub subject_type: String, // "role" or "user"
    pub subject_id: Uuid,
}

#[derive(Deserialize)]
pub struct SimulatePayload {
    pub action: String,
    pub resource: String,
    pub context: AuthContext,
}

pub async fn list_roles(
    State(state): State<AppState>,
) -> Result<Json<Vec<crate::models::user_role::Role>>, StatusCode> {
    let roles = policy_service::list_roles(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(roles))
}

pub async fn list_policies(
    State(state): State<AppState>,
) -> Result<Json<Vec<Policy>>, StatusCode> {
    let policies = policy_service::list_policies(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(policies))
}

pub async fn create_policy(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<CreatePolicyPayload>,
) -> Result<(StatusCode, Json<Policy>), StatusCode> {
    authorize_action(&state, &headers, "create", "policy").await?;

    let policy = policy_service::create_policy(
        &state.db,
        payload.policy_number,
        &payload.name,
        payload.description.as_deref(),
    )
    .await
    .map_err(|e| {
        eprintln!("Create policy error: {:?}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok((StatusCode::CREATED, Json(policy)))
}

pub async fn activate_policy(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    authorize_action(&state, &headers, "activate", "policy").await?;

    policy_service::activate_policy(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::OK)
}

pub async fn archive_policy(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    authorize_action(&state, &headers, "archive", "policy").await?;

    policy_service::archive_policy(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}

pub async fn delete_policy(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    authorize_action(&state, &headers, "delete", "policy").await?;

    policy_service::delete_policy(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}

pub async fn add_policy_rule(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<AddRulePayload>,
) -> Result<(StatusCode, Json<PolicyRule>), StatusCode> {
    authorize_action(&state, &headers, "edit", "policy").await?;

    let rule = policy_service::add_policy_rule(
        &state.db,
        id,
        &payload.effect,
        &payload.resource,
        &payload.action,
        payload.conditions,
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(rule)))
}

pub async fn bind_policy(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<BindPolicyPayload>,
) -> Result<(StatusCode, Json<PolicyBinding>), StatusCode> {
    authorize_action(&state, &headers, "bind", "policy").await?;

    let binding = policy_service::bind_policy(
        &state.db,
        id,
        &payload.subject_type,
        payload.subject_id,
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(binding)))
}

pub async fn simulate_auth(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<SimulatePayload>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // Current user must have 'simulate' permission
    let user = authorize_action(&state, &headers, "simulate", "auth").await?;

    let decision = auth_service::authorize(
        &state.db,
        &user,
        &payload.action,
        &payload.resource,
        &payload.context,
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(json!({
        "allowed": decision.allowed,
        "reason": decision.reason,
        "policy_id": decision.policy_id
    })))
}
pub async fn list_policy_rules(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<PolicyRule>>, StatusCode> {
    let rules = policy_service::list_policy_rules(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(rules))
}

pub async fn list_policy_bindings(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<PolicyBinding>>, StatusCode> {
    let bindings = policy_service::list_policy_bindings(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(bindings))
}

pub async fn list_role_policies(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<Policy>>, StatusCode> {
    let policies = policy_service::list_policies_for_subject(&state.db, "role", id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(policies))
}

pub async fn list_user_policies(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<Policy>>, StatusCode> {
    let policies = policy_service::list_policies_for_subject(&state.db, "user", id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(policies))
}

pub async fn remove_policy_rule(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    authorize_action(&state, &headers, "edit", "policy").await?;

    policy_service::remove_policy_rule(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}

pub async fn unbind_policy(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    authorize_action(&state, &headers, "bind", "policy").await?;

    policy_service::unbind_policy(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}
