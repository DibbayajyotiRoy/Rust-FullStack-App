use axum::{
    routing::{get, post},
    Router,
};

use crate::{
    handlers::payslip_handler,
    state::app_state::AppState,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route(
            "/",
            post(payslip_handler::create_payslip)
            .get(payslip_handler::list_my_payslips),
        )
        .route(
            "/{id}",
            get(payslip_handler::get_payslip),
        )
}
