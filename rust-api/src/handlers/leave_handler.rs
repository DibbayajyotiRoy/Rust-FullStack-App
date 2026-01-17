use axum::{
    extract::{Path, State},
    http::{StatusCode, HeaderMap},
    Json,
};
use uuid::Uuid;

use crate::{
    models::leave_request::{LeaveRequest, CreateLeaveRequestPayload, UpdateLeaveStatusPayload},
    services::leave_service,
    state::app_state::AppState,
    utils::auth::{authorize_action, get_user_id_from_headers},
};

pub async fn create_leave_request(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<CreateLeaveRequestPayload>,
) -> Result<(StatusCode, Json<LeaveRequest>), StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;
    
    // Validate reason has at least 5 words
    let word_count = payload.reason.split_whitespace().count();
    if word_count < 5 {
        return Err(StatusCode::BAD_REQUEST);
    }
    
    // Validate leave type
    let valid_types = ["Casual", "Sick", "Unpaid"];
    if !valid_types.contains(&payload.leave_type.as_str()) {
        return Err(StatusCode::BAD_REQUEST);
    }

    let leave_request = leave_service::create_leave_request(&state.db, user_id, payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(leave_request)))
}

pub async fn list_my_leave_requests(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<Vec<LeaveRequest>>, StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    let requests = leave_service::list_leave_requests_for_user(&state.db, user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(requests))
}

pub async fn list_all_leave_requests(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<Vec<LeaveRequest>>, StatusCode> {
    // Only managers/admins can view all leave requests
    authorize_action(&state, &headers, "read", "leave_request").await?;

    let requests = leave_service::list_all_leave_requests(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(requests))
}

pub async fn get_leave_request(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<LeaveRequest>, StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    let request = leave_service::get_leave_request(&state.db, id)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    // Users can only view their own requests unless they're admins
    if request.user_id != user_id {
        authorize_action(&state, &headers, "read", "leave_request").await?;
    }

    Ok(Json(request))
}

pub async fn update_leave_status(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateLeaveStatusPayload>,
) -> Result<Json<LeaveRequest>, StatusCode> {
    // Only managers can approve/reject
    authorize_action(&state, &headers, "update", "leave_request").await?;
    
    let approver_id = get_user_id_from_headers(&state, &headers).await?;
    
    // Validate status
    let valid_statuses = ["Approved", "Rejected"];
    if !valid_statuses.contains(&payload.status.as_str()) {
        return Err(StatusCode::BAD_REQUEST);
    }

    let request = leave_service::update_leave_status(&state.db, id, &payload.status, approver_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(request))
}

pub async fn delete_leave_request(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    // Get the request first to check ownership
    let request = leave_service::get_leave_request(&state.db, id)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    // Only the owner can delete their pending request
    if request.user_id != user_id {
        return Err(StatusCode::FORBIDDEN);
    }

    if request.status != "Pending" {
        return Err(StatusCode::BAD_REQUEST);
    }

    let affected = leave_service::delete_leave_request(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if affected == 0 {
        return Err(StatusCode::NOT_FOUND);
    }

    Ok(StatusCode::NO_CONTENT)
}
