use axum::{
    extract::{Path, State},
    http::{StatusCode, HeaderMap},
    Json,
};
use uuid::Uuid;

use crate::{
    models::report::{Report, CreateReportPayload, UpdateReportStatusPayload},
    services::report_service,
    state::app_state::AppState,
    utils::auth::{authorize_action, get_user_id_from_headers},
};

pub async fn create_report(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<CreateReportPayload>,
) -> Result<(StatusCode, Json<Report>), StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    let report = report_service::create_report(&state.db, user_id, payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(report)))
}

pub async fn list_my_reports(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<Vec<Report>>, StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    let reports = report_service::list_reports_for_user(&state.db, user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(reports))
}

pub async fn list_all_reports(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<Vec<Report>>, StatusCode> {
    // Only managers can view all reports
    authorize_action(&state, &headers, "read", "report").await?;

    let reports = report_service::list_all_reports(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(reports))
}

pub async fn get_report(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Report>, StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    let report = report_service::get_report(&state.db, id)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    // Users can only view their own reports unless they're admins
    if report.user_id != user_id {
        authorize_action(&state, &headers, "read", "report").await?;
    }

    Ok(Json(report))
}

pub async fn update_report_status(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateReportStatusPayload>,
) -> Result<Json<Report>, StatusCode> {
    // Only managers can mark reports as reviewed
    authorize_action(&state, &headers, "update", "report").await?;
    
    let valid_statuses = ["Submitted", "Reviewed"];
    if !valid_statuses.contains(&payload.status.as_str()) {
        return Err(StatusCode::BAD_REQUEST);
    }

    let report = report_service::update_report_status(&state.db, id, &payload.status)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(report))
}
