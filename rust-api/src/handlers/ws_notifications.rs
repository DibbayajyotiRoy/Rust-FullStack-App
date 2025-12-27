use axum::{ extract::{ ws::{ WebSocket, WebSocketUpgrade }, State }, response::IntoResponse };
use futures_util::StreamExt;

use crate::state::app_state::AppState;

pub async fn ws_notifications(
    ws: WebSocketUpgrade,
    State(state): State<AppState>
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: AppState) {
    // Send historical notifications first
    if let Ok(notifications) = crate::services::notification_service::get_recent_notifications(&state.db, 50).await {
        for notification in notifications {
            let msg = serde_json::to_string(&notification).unwrap();
            if socket.send(msg.into()).await.is_err() {
                return;
            }
        }
    }

    let mut rx = state.notifications.subscribe();

    loop {
        tokio::select! {
    Ok(event) = rx.recv() => {
        let msg = serde_json::to_string(&event).unwrap();
        if socket.send(msg.into()).await.is_err() {
            break;
        }
    }
    Some(_) = socket.next() => {
        // ignore client messages
    }
}
    }
}
