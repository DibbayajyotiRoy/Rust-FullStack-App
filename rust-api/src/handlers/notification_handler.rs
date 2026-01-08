use axum::{
    extract::{Path, State},
    http::{StatusCode, HeaderMap},
    response::IntoResponse,
};
use uuid::Uuid;

use crate::{
    state::app_state::AppState,
    services::notification_service,
    utils::auth::authorize_action,
};

pub async fn mark_read(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, StatusCode> {
    authorize_action(&state, &headers, "update", "notification").await?;

    match notification_service::mark_as_read(&state.db, id).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn mark_all_read(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<impl IntoResponse, StatusCode> {
    authorize_action(&state, &headers, "update", "notification").await?;

    match notification_service::mark_all_as_read(&state.db).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
