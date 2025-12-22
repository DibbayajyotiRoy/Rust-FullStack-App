// use axum::{
//     extract::{ Path, State },
//     http::StatusCode,
//     routing::{ get, post },
//     Json,
//     Router,
// };
// use tower_http::services::{ ServeDir, ServeFile };
// use serde::{ Deserialize, Serialize };
// use sqlx::{ postgres::PgPoolOptions, FromRow, PgPool };
// use std::env;
// use uuid::Uuid;

// #[derive(Deserialize)]
// struct UserPayload {
//     username: String,
//     email: String,
//     password_hash: String,
// }

// #[derive(Serialize, FromRow)]
// struct User {
//     id: Uuid,
//     username: String,
//     email: String,
//     password_hash: String,
//     created_at: chrono::NaiveDateTime,
//     updated_at: chrono::NaiveDateTime,
// }

// #[tokio::main]
// async fn main(){
//     let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
//     let pool = PgPoolOptions::new().connect(&db_url).await.expect("Failed to connect to DATABASE");
//     sqlx::migrate!().run(&pool).await.expect("Failed to run migrations");

//     let frontend_dir = std::path::PathBuf::from("./dist");
    
//     let static_service = ServeDir::new(&frontend_dir).not_found_service(ServeFile::new(frontend_dir.join("index.html")));
    
//     let api_routes = Router::new()
//         .route("/", get(root))
//         .route("/users", post(create_user).get(list_users))
//         .route("/users/{id}", get(get_user).put(update_user).delete(delete_user))
//         .with_state(pool);


//     let app = Router::new()
//         .nest("/api", api_routes)
//         .fallback_service(static_service);

//     let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();
//     println!("Server is Up and Running on port 8000");
//     axum::serve(listener, app).await.unwrap();
// }


// //Endpoint Handlers

// //Health Check
// async fn root() -> &'static str {
//     "Welcome to the User Management Rust API!"
// }

// //GET ALL USERS
// async fn list_users(State(pool): State<PgPool>) -> Result<Json<Vec<User>>, StatusCode> {
//     sqlx::query_as::<_, User>("SELECT * FROM users")
//         .fetch_all(&pool).await
//         .map(Json)
//         .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
// }       

// //CREATE A NEW USER
// async fn create_user(
//     State(pool): State<PgPool>,
//     Json(payload): Json<UserPayload>,
// ) -> Result<(StatusCode, Json<User>), StatusCode> {
//     let user = sqlx::query_as::<_, User>(
//         r#"
//         INSERT INTO users (username, email, password_hash)
//         VALUES ($1, $2, $3)
//         RETURNING
//             id,
//             username,
//             email,
//             password_hash,
//             created_at,
//             updated_at
//         "#
//     )
//     .bind(&payload.username)
//     .bind(&payload.email)
//     .bind(&payload.password_hash)
//     .fetch_one(&pool)
//     .await
//     .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

//     Ok((StatusCode::CREATED, Json(user)))
// }


// //GET A USER BY ID
// async fn get_user(
//     State(pool): State<PgPool>,
//     Path(id): Path<Uuid>,
// ) -> Result<Json<User>, StatusCode> {
//     sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
//         .bind(id)
//         .fetch_one(&pool).await
//         .map(Json)
//         .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
// }

// //UPDATE A USER BY ID
// async fn update_user(
//     State(pool): State<PgPool>,
//     Path(id): Path<Uuid>,
//     Json(payload): Json<UserPayload>,
// ) -> Result<Json<User>, StatusCode> {
//     sqlx::query_as::<_, User>(
//         "UPDATE users SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
//     )
//     .bind(&payload.username)
//     .bind(&payload.email)
//     .bind(id)
//     .fetch_one(&pool).await
//     .map(Json)
//     .map_err(|e| {
//         eprintln!("Update error: {:?}", e);
//         StatusCode::INTERNAL_SERVER_ERROR
//     })
// }

// //DELETE A USER BY ID
// async fn delete_user(
//     State(pool): State<PgPool>,
//     Path(id): Path<Uuid>,
// ) -> Result<StatusCode, StatusCode> {
//     let result = sqlx::query("DELETE FROM users WHERE id = $1")
//         .bind(id)
//         .execute(&pool).await
//         .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
//     if result.rows_affected() == 0 {
//         return Err(StatusCode::NOT_FOUND);
//     }else{
//         Ok(StatusCode::NO_CONTENT)
//     }
// }


use tokio::net::TcpListener;

mod app;
mod config;
mod db;
mod handlers;
mod models;
mod routes;
mod services;
mod state;
mod utils;

#[tokio::main]
async fn main() {
    // config::env::load();

    let state = state::app_state::AppState::new().await;
    let app = app::create_app(state);

    let listener = TcpListener::bind("0.0.0.0:8000")
        .await
        .expect("Failed to bind port");

    println!("🚀 Server running on http://localhost:8000");
    axum::serve(listener, app).await.unwrap();
}
