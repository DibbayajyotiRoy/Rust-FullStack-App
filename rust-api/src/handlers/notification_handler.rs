use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};
use uuid::Uuid;

use crate::state::app_state::AppState;
use crate::services::notification_service;

pub async fn mark_read(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    match notification_service::mark_as_read(&state.db, id).await {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}

pub async fn mark_all_read(
    State(state): State<AppState>,
) -> impl IntoResponse {
    match notification_service::mark_all_as_read(&state.db).await {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}
