use axum::{
    extract::{Path, State},
    http::{StatusCode, HeaderMap, header},
    Json,
};
use sqlx::{PgPool, Row};
use uuid::Uuid;
use serde::Deserialize;

use crate::{
    models::user::User,
    models::user_role::{Policy, PolicyVersion, Role},
    services::policy_service,
    services::auth_service,
    services::user_service,
    state::app_state::AppState,
};

#[derive(Deserialize)]
pub struct CreatePolicyPayload {
    pub policy_number: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdatePolicyPayload {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct AssignPolicyPayload {
    pub role_id: Uuid,
}

#[derive(Deserialize)]
pub struct SetEditorPayload {
    pub role_level: i32,
}

// Helper to get current user from session
async fn get_current_user(state: &AppState, headers: &HeaderMap) -> Result<User, StatusCode> {
    let cookie_header = headers.get(header::COOKIE)
        .ok_or(StatusCode::UNAUTHORIZED)?;
    
    let cookie_str = cookie_header.to_str().map_err(|_| StatusCode::BAD_REQUEST)?;
    let token = cookie_str.split(';')
        .find(|s| s.trim().starts_with("session_token="))
        .map(|s| s.trim().trim_start_matches("session_token="))
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let session = auth_service::validate_session(&state.db, token)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::UNAUTHORIZED)?;

    user_service::get_user(&state.db, session.user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

// Helper to check if user has a specific role level or better
async fn check_role_level(state: &AppState, user: &User, required_level: i32) -> Result<(), StatusCode> {
    if let Some(role_id) = user.role_id {
        let roles = policy_service::list_roles(&state.db).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        if let Some(role) = roles.iter().find(|r| r.id == role_id) {
            if role.level <= required_level {
                return Ok(());
            }
        }
    }
    Err(StatusCode::FORBIDDEN)
}

pub async fn list_roles(
    State(state): State<AppState>,
) -> Result<Json<Vec<Role>>, StatusCode> {
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
    let user = get_current_user(&state, &headers).await?;
    check_role_level(&state, &user, 0).await?; // Level 0 can create

    let policy = policy_service::create_policy(
        &state.db,
        payload.policy_number,
        &payload.name,
        payload.description.as_deref(),
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(policy)))
}

pub async fn update_policy(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdatePolicyPayload>,
) -> Result<Json<Policy>, StatusCode> {
    let user = get_current_user(&state, &headers).await?;
    
    // Check if user is level 0 OR has specific editor permission
    // For simplicity, we check level 0 first. 
    // If not 0, we check policy_editor_permissions.
    let is_admin = check_role_level(&state, &user, 0).await.is_ok();
    
    if !is_admin {
        // Check editor permissions
        // In a real app, this would be a single query
        let roles = policy_service::list_roles(&state.db).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let user_role = roles.iter().find(|r| r.id == user.role_id.unwrap()).ok_or(StatusCode::FORBIDDEN)?;
        
        let editors = sqlx::query(
            "SELECT role_level FROM policy_editor_permissions WHERE policy_id = $1"
        )
        .bind(id)
        .fetch_all(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        
        if !editors.iter().any(|e| e.get::<i32, _>("role_level") >= user_role.level) {
             return Err(StatusCode::FORBIDDEN);
        }
    }

    let policy = policy_service::update_policy(
        &state.db,
        id,
        &payload.name,
        payload.description.as_deref(),
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(policy))
}

pub async fn archive_policy(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    let user = get_current_user(&state, &headers).await?;
    check_role_level(&state, &user, 0).await?;

    policy_service::archive_policy(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}

pub async fn get_policy_versions(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<PolicyVersion>>, StatusCode> {
    let versions = policy_service::get_policy_versions(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(versions))
}

pub async fn list_policies_for_role(
    State(state): State<AppState>,
    Path(role_id): Path<Uuid>,
) -> Result<Json<Vec<Policy>>, StatusCode> {
    let policies = policy_service::list_policies_for_role(&state.db, role_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(policies))
}

pub async fn assign_policy_to_role(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(policy_id): Path<Uuid>,
    Json(payload): Json<AssignPolicyPayload>,
) -> Result<StatusCode, StatusCode> {
    let user = get_current_user(&state, &headers).await?;
    check_role_level(&state, &user, 0).await?;

    policy_service::assign_policy_to_role(&state.db, payload.role_id, policy_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::OK)
}

pub async fn set_policy_editor_level(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(policy_id): Path<Uuid>,
    Json(payload): Json<SetEditorPayload>,
) -> Result<StatusCode, StatusCode> {
    let user = get_current_user(&state, &headers).await?;
    check_role_level(&state, &user, 0).await?;

    policy_service::set_policy_editor_level(&state.db, policy_id, payload.role_level)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::OK)
}
