use serde::{Deserialize, Serialize};
use tauri::{State, command};
use std::sync::Mutex;
use std::collections::HashMap;
use uuid::Uuid;
use chrono::Utc;
mod routes;
use tauri::http::ResponseBuilder;
use tauri::plugin::TauriPlugin;

// State management
#[derive(Default)]
pub struct AppState {
    users: Mutex<HashMap<String, User>>,
    sessions: Mutex<HashMap<String, GameSession>>,
    items: Mutex<HashMap<String, ItemMetadata>>,
}

// Data structures
#[derive(Serialize, Deserialize, Clone)]
pub struct User {
    logged_in: bool,
    address: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct GameSession {
    session_id: String,
    user_address: String,
    start_time: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ItemMetadata {
    name: String,
    item_type: String,
    rarity: String,
}

#[derive(Serialize, Deserialize)]
pub struct ApiResponse<T> {
    data: T,
    timestamp: String,
    status: String,
}

// Helper function for creating API responses
fn create_response<T>(data: T, status: &str) -> ApiResponse<T> {
    ApiResponse {
        data,
        timestamp: Utc::now().to_rfc3339(),
        status: status.to_string(),
    }
}

// Authentication helper
fn check_auth(state: &AppState, address: &str) -> Result<(), String> {
    let users = state.users.lock().unwrap();
    match users.get(address) {
        Some(user) if user.logged_in => Ok(()),
        _ => Err("Please login with Flow wallet".to_string()),
    }
}

// Command implementations
#[tauri::command]
async fn get_user_info(
    address: String,
    state: State<AppState>
) -> Result<ApiResponse<User>, String> {
    check_auth(&state, &address)?;
    let users = state.users.lock().unwrap();
    
    match users.get(&address) {
        Some(user) => Ok(create_response(user.clone(), "success")),
        None => Err("User not found".to_string()),
    }
}

#[tauri::command]
async fn get_item_metadata(
    item_id: String,
    user_address: String,
    state: State<AppState>
) -> Result<ApiResponse<ItemMetadata>, String> {
    check_auth(&state, &user_address)?;
    let items = state.items.lock().unwrap();
    
    match items.get(&item_id) {
        Some(item) => Ok(create_response(item.clone(), "success")),
        None => Err("Item not found".to_string()),
    }
}

#[tauri::command]
async fn start_game_session(
    user_address: String,
    state: State<AppState>
) -> Result<ApiResponse<GameSession>, String> {
    check_auth(&state, &user_address)?;
    let session_id = Uuid::new_v4().to_string();
    
    let new_session = GameSession {
        session_id: session_id.clone(),
        user_address,
        start_time: Utc::now().to_rfc3339(),
    };
    
    state.sessions.lock().unwrap().insert(session_id, new_session.clone());
    Ok(create_response(new_session, "success"))
}

#[tauri::command]
async fn end_game_session(
    session_id: String,
    user_address: String,
    state: State<AppState>
) -> Result<ApiResponse<String>, String> {
    check_auth(&state, &user_address)?;
    let mut sessions = state.sessions.lock().unwrap();
    
    match sessions.remove(&session_id) {
        Some(_) => Ok(create_response(session_id, "success")),
        None => Err("Session not found".to_string()),
    }
}

#[tauri::command]
async fn add_item(
    user_address: String,
    item: ItemMetadata,
    state: State<AppState>
) -> Result<ApiResponse<ItemMetadata>, String> {
    check_auth(&state, &user_address)?;
    let item_id = Uuid::new_v4().to_string();
    
    state.items.lock().unwrap().insert(item_id, item.clone());
    Ok(create_response(item, "success"))
}

fn init_http_server() -> TauriPlugin {
    tauri::plugin::Builder::new("http")
        .setup(|app| {
            let state = app.state::<AppState>();
            let port = 3030; // Choose your port

            tauri::async_runtime::spawn(async move {
                let addr = ([127, 0, 0, 1], port).into();
                let service = tower::service_fn(move |req| {
                    let state = state.clone();
                    async move { routes::handle_routes(req, state).await }
                });

                if let Err(e) = hyper::Server::bind(&addr)
                    .serve(tower::make::Shared::new(service))
                    .await
                {
                    eprintln!("Server error: {}", e);
                }
            });

            Ok(())
        })
        .build()
}

fn main() {
    tauri::Builder::default()
        .manage(AppState::default())
        .plugin(tauri::plugins::api::all())
        .plugin(init_http_server())
        .invoke_handler(tauri::generate_handler![
            get_user_info,
            get_item_metadata,
            start_game_session,
            end_game_session,
            add_item,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
} 