use axum::{
    extract::{Path, State},
    http::{StatusCode, HeaderMap},
    Json,
};
use uuid::Uuid;

use crate::{
    models::payslip::{Payslip, CreatePayslipPayload},
    services::payslip_service,
    state::app_state::AppState,
    utils::auth::{authorize_action, get_user_id_from_headers},
};

pub async fn create_payslip(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<CreatePayslipPayload>,
) -> Result<(StatusCode, Json<Payslip>), StatusCode> {
    // Only managers/admins can create payslips
    authorize_action(&state, &headers, "create", "payslip").await?;

    let payslip = payslip_service::create_payslip(&state.db, payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(payslip)))
}

pub async fn list_my_payslips(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<Vec<Payslip>>, StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    let payslips = payslip_service::list_payslips_for_user(&state.db, user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(payslips))
}

pub async fn get_payslip(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<Payslip>, StatusCode> {
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    let payslip = payslip_service::get_payslip(&state.db, id)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    // Users can only view their own payslips
    if payslip.user_id != user_id {
        authorize_action(&state, &headers, "read", "payslip").await?;
    }

    Ok(Json(payslip))
}
