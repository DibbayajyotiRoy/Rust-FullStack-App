use axum::{
    extract::State,
    http::{StatusCode, HeaderMap, header},
    Json,
};
use bcrypt::verify;
use serde_json::json;

use crate::{
    models::user::{LoginPayload, User},
    services::auth_service,
    services::user_service,
    state::app_state::AppState,
};

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginPayload>,
) -> Result<(HeaderMap, Json<serde_json::Value>), StatusCode> {
    let user = auth_service::find_user_by_identify(&state.db, &payload.identity)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::UNAUTHORIZED)?;

    if !verify(&payload.password, &user.password_hash).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)? {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let session = auth_service::create_session(&state.db, user.id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut headers = HeaderMap::new();
    let cookie = format!("session_token={}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800", session.token);
    headers.insert(header::SET_COOKIE, cookie.parse().unwrap());

    Ok((headers, Json(json!({ "message": "Login successful", "user": user }))))
}

pub async fn logout(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<HeaderMap, StatusCode> {
    if let Some(cookie_header) = headers.get(header::COOKIE) {
        let cookie_str = cookie_header.to_str().map_err(|_| StatusCode::BAD_REQUEST)?;
        if let Some(token) = cookie_str.split(';')
            .find(|s| s.trim().starts_with("session_token="))
            .map(|s| s.trim().trim_start_matches("session_token=")) {
            
            let _ = auth_service::delete_session(&state.db, token).await;
        }
    }

    let mut headers = HeaderMap::new();
    let cookie = "session_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
    headers.insert(header::SET_COOKIE, cookie.parse().unwrap());

    Ok(headers)
}

pub async fn me(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<Json<User>, StatusCode> {
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

    let user = user_service::get_user(&state.db, session.user_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(user))
}
