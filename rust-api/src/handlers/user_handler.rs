use axum::{
    extract::{Path, State},
    http::{StatusCode, HeaderMap},
    Json,
};
use uuid::Uuid;
use bcrypt::{hash, DEFAULT_COST};

use crate::{
    models::user::{CreateUserPayload, UpdateUserPayload, User, UserWithRole},
    services::user_service,
    state::app_state::AppState,
    utils::auth::authorize_action,
};

pub async fn create_user(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<CreateUserPayload>,
) -> Result<(StatusCode, Json<User>), StatusCode> {
    authorize_action(&state, &headers, "create", "user").await?;

    let username = payload.username.clone();
    
    // Hash password before storage
    let password_hash = hash(&payload.password_hash, DEFAULT_COST)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_payload = CreateUserPayload {
        username: payload.username.clone(),
        email: payload.email.clone(),
        password_hash,
    };

    let user = user_service::create_user(&state.db, user_payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Trigger notification
    let _ = crate::services::notification_service::create_notification(
        &state.db,
        &state.notifications,
        "USER_CREATED",
        &format!("New user added: {}", username),
        Some(user.id),
    ).await;

    Ok((StatusCode::CREATED, Json(user)))
}

pub async fn list_users(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<Vec<UserWithRole>>, StatusCode> {
    authorize_action(&state, &headers, "read", "user").await?;

    let users = user_service::list_users(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(users))
}

pub async fn get_user(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<User>, StatusCode> {
    authorize_action(&state, &headers, "read", "user").await?;

    let user = user_service::get_user(&state.db, id)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(user))
}

pub async fn update_user(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateUserPayload>,
) -> Result<Json<User>, StatusCode> {
    authorize_action(&state, &headers, "update", "user").await?;

    let user = user_service::update_user(&state.db, id, payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(user))
}

pub async fn delete_user(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    authorize_action(&state, &headers, "delete", "user").await?;

    // Fetch user first to get the username for the notification
    let user = match user_service::get_user(&state.db, id).await {
        Ok(u) => u,
        Err(_) => return Err(StatusCode::NOT_FOUND),
    };

    let username = user.username.clone();

    let affected = user_service::delete_user(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if affected == 0 {
        return Err(StatusCode::NOT_FOUND);
    }

    // Trigger notification
    let _ = crate::services::notification_service::create_notification(
        &state.db,
        &state.notifications,
        "USER_DELETED",
        &format!("User deleted: {}", username),
        None,
    ).await;

    Ok(StatusCode::NO_CONTENT)
}

