use axum::{
    http::{StatusCode, HeaderMap, header},
};
use crate::{
    models::user::User,
    models::user_role::AuthContext,
    services::auth_service,
    services::user_service,
    state::app_state::AppState,
};

pub async fn authorize_action(
    state: &AppState,
    headers: &HeaderMap,
    action: &str,
    resource: &str,
) -> Result<User, StatusCode> {
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

    let context = AuthContext {
        department: None, // Could be enriched from user profile
        location: None,
        time: chrono::Utc::now().to_rfc3339(),
        resource_owner_id: None,
    };

    let decision = auth_service::authorize(&state.db, &user, action, resource, &context)
        .await
        .map_err(|e| {
            eprintln!("Authorization engine error: {:?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if !decision.allowed {
        eprintln!("Action FORBIDDEN: User {} tried to {} on {}", user.username, action, resource);
        return Err(StatusCode::FORBIDDEN);
    }

    Ok(user)
}
