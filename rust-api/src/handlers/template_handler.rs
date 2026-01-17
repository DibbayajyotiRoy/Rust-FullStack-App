use axum::{
    extract::{Path, State},
    http::{StatusCode, HeaderMap},
    Json,
};
use uuid::Uuid;

use crate::{
    models::payslip_template::{PayslipTemplate, CreatePayslipTemplatePayload, UpdatePayslipTemplatePayload},
    services::template_service,
    state::app_state::AppState,
    utils::auth::{authorize_action, get_user_id_from_headers},
};

pub async fn create_template(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(payload): Json<CreatePayslipTemplatePayload>,
) -> Result<(StatusCode, Json<PayslipTemplate>), StatusCode> {
    // Only managers/admins can create templates
    authorize_action(&state, &headers, "create", "payslip_template").await?;
    
    let user_id = get_user_id_from_headers(&state, &headers).await?;

    let template = template_service::create_template(&state.db, user_id, payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(template)))
}

pub async fn list_templates(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<Vec<PayslipTemplate>>, StatusCode> {
    // Only managers/admins can view templates
    authorize_action(&state, &headers, "read", "payslip_template").await?;

    let templates = template_service::list_templates(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(templates))
}

pub async fn get_template(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<PayslipTemplate>, StatusCode> {
    authorize_action(&state, &headers, "read", "payslip_template").await?;

    let template = template_service::get_template(&state.db, id)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(template))
}

pub async fn update_template(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdatePayslipTemplatePayload>,
) -> Result<Json<PayslipTemplate>, StatusCode> {
    authorize_action(&state, &headers, "update", "payslip_template").await?;

    let template = template_service::update_template(&state.db, id, payload)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(template))
}

pub async fn set_active_template(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<PayslipTemplate>, StatusCode> {
    authorize_action(&state, &headers, "update", "payslip_template").await?;

    let template = template_service::set_active_template(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(template))
}

pub async fn delete_template(
    headers: HeaderMap,
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    authorize_action(&state, &headers, "delete", "payslip_template").await?;

    let affected = template_service::delete_template(&state.db, id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if affected == 0 {
        return Err(StatusCode::NOT_FOUND);
    }

    Ok(StatusCode::NO_CONTENT)
}
