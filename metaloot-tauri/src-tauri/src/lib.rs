// use serde::{Deserialize, Serialize};
// use tauri::{State, command};
// use std::sync::Mutex;
// use std::collections::HashMap;
// use uuid::Uuid;
// use chrono::Utc;
// mod routes;

// use tauri::plugin::TauriPlugin;

// // State management
// #[derive(Default)]
// pub struct AppState {
//     users: Mutex<HashMap<String, User>>,
//     sessions: Mutex<HashMap<String, GameSession>>,
//     items: Mutex<HashMap<String, ItemMetadata>>,
// }

// // Data structures
// #[derive(Serialize, Deserialize, Clone)]
// pub struct User {
//     logged_in: bool,
//     address: String,
// }

// #[derive(Serialize, Deserialize, Clone)]
// pub struct GameSession {
//     session_id: String,
//     user_address: String,
//     start_time: String,
// }

// #[derive(Serialize, Deserialize, Clone)]
// pub struct ItemMetadata {
//     name: String,
//     item_type: String,
//     rarity: String,
// }

// #[derive(Serialize, Deserialize)]
// pub struct ApiResponse<T> {
//     data: T,
//     timestamp: String,
//     status: String,
// }

// // Helper function for creating API responses
// fn create_response<T>(data: T, status: &str) -> ApiResponse<T> {
//     ApiResponse {
//         data,
//         timestamp: Utc::now().to_rfc3339(),
//         status: status.to_string(),
//     }
// }

// // Authentication helper
// fn check_auth(state: &AppState, address: &str) -> Result<(), String> {
//     let users = state.users.lock().unwrap();
//     match users.get(address) {
//         Some(user) if user.logged_in => Ok(()),
//         _ => Err("Please login with Flow wallet".to_string()),
//     }
// }

// // Command implementations
// #[tauri::command]
// async fn get_user_info(
//     address: String,
//     state: State<AppState>
// ) -> Result<ApiResponse<User>, String> {
//     check_auth(&state, &address)?;
//     let users = state.users.lock().unwrap();

//     match users.get(&address) {
//         Some(user) => Ok(create_response(user.clone(), "success")),
//         None => Err("User not found".to_string()),
//     }
// }

// #[tauri::command]
// async fn get_item_metadata(
//     item_id: String,
//     user_address: String,
//     state: State<AppState>
// ) -> Result<ApiResponse<ItemMetadata>, String> {
//     check_auth(&state, &user_address)?;
//     let items = state.items.lock().unwrap();

//     match items.get(&item_id) {
//         Some(item) => Ok(create_response(item.clone(), "success")),
//         None => Err("Item not found".to_string()),
//     }
// }

// #[tauri::command]
// async fn start_game_session(
//     user_address: String,
//     state: State<AppState>
// ) -> Result<ApiResponse<GameSession>, String> {
//     check_auth(&state, &user_address)?;
//     let session_id = Uuid::new_v4().to_string();

//     let new_session = GameSession {
//         session_id: session_id.clone(),
//         user_address,
//         start_time: Utc::now().to_rfc3339(),
//     };

//     state.sessions.lock().unwrap().insert(session_id, new_session.clone());
//     Ok(create_response(new_session, "success"))
// }

// #[tauri::command]
// async fn end_game_session(
//     session_id: String,
//     user_address: String,
//     state: State<AppState>
// ) -> Result<ApiResponse<String>, String> {
//     check_auth(&state, &user_address)?;
//     let mut sessions = state.sessions.lock().unwrap();

//     match sessions.remove(&session_id) {
//         Some(_) => Ok(create_response(session_id, "success")),
//         None => Err("Session not found".to_string()),
//     }
// }

// #[tauri::command]
// async fn add_item(
//     user_address: String,
//     item: ItemMetadata,
//     state: State<AppState>
// ) -> Result<ApiResponse<ItemMetadata>, String> {
//     check_auth(&state, &user_address)?;
//     let item_id = Uuid::new_v4().to_string();

//     state.items.lock().unwrap().insert(item_id, item.clone());
//     Ok(create_response(item, "success"))
// }

// fn init_http_server() -> TauriPlugin {
//     tauri::plugin::Builder::new("http")
//         .setup(|app| {
//             let state = app.state::<AppState>();
//             let port = 3030; // Choose your port

//             tauri::async_runtime::spawn(async move {
//                 let addr = ([127, 0, 0, 1], port).into();
//                 let service = tower::service_fn(move |req| {
//                     let state = state.clone();
//                     async move { routes::handle_routes(req, state).await }
//                 });

//                 if let Err(e) = hyper::Server::bind(&addr)
//                     .serve(tower::make::Shared::new(service))
//                     .await
//                 {
//                     eprintln!("Server error: {}", e);
//                 }
//             });

//             Ok(())
//         })
//         .build()
// }

// Add these imports at the top of the file
use actix_web::{get, post, App, HttpResponse, HttpServer, Responder};
use once_cell::sync::Lazy;
use once_cell::sync::OnceCell;
use serde_json::Value;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter};

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct UserData {
    addr: String,
    cid: String,
    #[serde(rename = "loggedIn")]
    logged_in: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct UserNFTData {
    id: String,
    name: String,
    attributes: ItemAttributes,
    thumbnail: String,
    description: Option<String>,
}


#[derive(Debug, Serialize, Deserialize)]
struct ItemAttributes {
    rarity: Option<String>,
    #[serde(rename = "originGame")]
    origin_game: Option<String>,
    description: Option<String>,
}

static GLOBAL_APP_HANDLE: OnceCell<AppHandle> = OnceCell::new();

// Change OnceLock to Mutex for mutability
static GLOBAL_USER_DATA: Lazy<Mutex<Option<UserData>>> = Lazy::new(|| Mutex::new(None));

static GLOBAL_USER_NFT_DATA: Lazy<Mutex<Option<Vec<UserNFTData>>>> = Lazy::new(|| Mutex::new(None));

static NFT_UPDATE_COMPLETED: Lazy<Mutex<bool>> = Lazy::new(|| Mutex::new(false));

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[get("/user/{address}")]
async fn get_user(path: actix_web::web::Path<String>) -> impl Responder {
    println!("/user/{}", path.to_owned());

    GLOBAL_APP_HANDLE
        .get()
        .unwrap()
        .emit("get-user", &path.into_inner())
        .unwrap();
    HttpResponse::Ok().finish()
}

#[get("/get-user-data")]
async fn get_user_data() -> impl Responder {
    let result = || -> Result<String, String> {
        let data = GLOBAL_USER_DATA
            .lock()
            .map_err(|_| "Failed to lock global user data".to_string())?;
        
        match &*data {
            Some(user_data) => {
                serde_json::to_string(&user_data)
                    .map_err(|e| format!("Failed to serialize user data: {}", e))
            },
            None => Err("No user data found".to_string())
        }
    }();

    match result {
        Ok(json) => HttpResponse::Ok().content_type("application/json").body(json),
        Err(e) => HttpResponse::InternalServerError().body(e)
    }
}

#[get("/get-user-nfts")]
async fn get_user_nfts() -> impl Responder {

    println!("hello");
    // Reset the completion flag
    *NFT_UPDATE_COMPLETED.lock().unwrap() = false;

    GLOBAL_APP_HANDLE
        .get()
        .unwrap()
        .emit("get-user-nfts", "")
        .unwrap();

    // Wait for the update to complete (poll the flag)
    while !*NFT_UPDATE_COMPLETED.lock().unwrap() {
        // println!("yooo");
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    }

    println!("hello1");

    let result = || -> Result<String, String> {
        let data = GLOBAL_USER_NFT_DATA
            .lock()
            .map_err(|_| "Failed to lock global user nft data".to_string())?;
        
        match &*data {
            Some(user_data) => {
                serde_json::to_string(&user_data)
                    .map_err(|e| format!("Failed to serialize user nft data: {}", e))
            },
            None => Err("No user data nft found".to_string())
        }
    }();

    match result {
        Ok(json) => HttpResponse::Ok().content_type("application/json").body(json),
        Err(e) => HttpResponse::InternalServerError().body(e)
    }
}


#[get("/item/{item_id}/metadata")]
async fn get_item_metadata(path: actix_web::web::Path<String>) -> impl Responder {
    println!("/item/{}/metadata", path);
    GLOBAL_APP_HANDLE
        .get()
        .unwrap()
        .emit("get-item-metadata", &path.into_inner())
        .unwrap();
    HttpResponse::Ok().finish()
}

#[get("/game/start")]
async fn start_game() -> impl Responder {
    println!("/game/start");
    GLOBAL_APP_HANDLE
        .get()
        .unwrap()
        .emit("start-game", "")
        .unwrap();
    HttpResponse::Ok().finish()
}

#[get("/game/end")]
async fn end_game() -> impl Responder {
    
    GLOBAL_APP_HANDLE
        .get()
        .unwrap()
        .emit("end-game", "")
        .unwrap();
    HttpResponse::Ok().finish()
}

#[get("/item/add")]
async fn add_item() -> impl Responder {
    println!("/item/add");
    GLOBAL_APP_HANDLE
        .get()
        .unwrap()
        .emit("add-item", serde_json::json!({
            "itemName": "something",
            "itemType": "123",
            "attributes": serde_json::json!({
                "attack":"100",
                "defense":3
            }),
            "thumpNail": "",
        }))
        .unwrap();
    HttpResponse::Ok().finish()
}

#[tauri::command]
fn store_user_data(user_data: String) -> Result<(), String> {
    println!("{:#?} storing user data", user_data);

    let user_data: UserData = serde_json::from_str(&user_data)
        .map_err(|e| {
            eprintln!("Deserialization error: {}", e);
            format!("Failed to deserialize user data: {}", e)
        })?;
      
    println!("Deserialized user data: {:?}", user_data);
    let mut data = GLOBAL_USER_DATA
        .lock()
        .map_err(|_| "Failed to lock global user data".to_string())?;
    *data = Some(user_data);
    Ok(())
}

#[tauri::command]
fn store_user_nft_data(user_nft_data: String) -> Result<(), String> {
    println!("we calling this function????");
    println!("{:#?} storing user nft data", user_nft_data);

    
    let user_nft_data: Vec<UserNFTData> = serde_json::from_str(&user_nft_data)
        .map_err(|e| {
            eprintln!("Deserialization error: {}", e);
            format!("Failed to deserialize user nft data: {}", e)
        })?;
      
    println!("Deserialized user nft data: {:?}", user_nft_data);
    let mut data = GLOBAL_USER_NFT_DATA
        .lock()
        .map_err(|_| "Failed to lock global user nft data".to_string())?;
    *data = Some(user_nft_data);
    Ok(())
}

#[tauri::command]
fn get_user_data_from_store() -> Result<String, String> {
    let data = GLOBAL_USER_DATA
        .lock()
        .map_err(|_| "Failed to lock global user data".to_string())?;
    
    match &*data {
        Some(user_data) => {
            serde_json::to_string(&user_data)
                .map_err(|e| format!("Failed to serialize user data: {}", e))
        },
        None => Err("No user data found".to_string())
    }
}

#[tauri::command]
fn update_completed() -> Result<(), String> {
    let mut completed = NFT_UPDATE_COMPLETED.lock().unwrap();
    *completed = true;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // tauri::Builder::default()
    //     .plugin(tauri_plugin_shell::init())
    //     .plugin(tauri_plugin_deep_link::init())
    //     .setup(|app| {
    //         // Start Actix web server
    //         let runtime = tokio::runtime::Runtime::new().unwrap();
    //         runtime.spawn(async {
    //             println!("Starting Actix Web server on http://127.0.0.1:8080");
    //             HttpServer::new(|| {
    //                 App::new()
    //                     .service(hello)
    //             })
    //             .bind(("127.0.0.1", 8080))
    //             .unwrap()
    //             .run()
    //             .await
    //             .unwrap();
    //         });

    //         if cfg!(debug_assertions) {
    //             app.handle().plugin(
    //                 tauri_plugin_log::Builder::default()
    //                     .level(log::LevelFilter::Info)
    //                     .build(),
    //             )?;
    //         }
    //         Ok(())
    //     })
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(tauri::generate_handler![
            store_user_data, 
            get_user_data_from_store, 
            store_user_nft_data,
            update_completed
        ])
        .setup(|app| {
            app.handle();
            // Start Actix web server
            let runtime = tokio::runtime::Runtime::new().unwrap();
            runtime.spawn(async {
                println!("Starting Actix Web server on http://127.0.0.1:8080");
                HttpServer::new(|| {
                    App::new()
                        .service(hello)
                        .service(get_user)
                        .service(get_item_metadata)
                        .service(start_game)
                        .service(end_game)
                        .service(add_item)
                        .service(get_user_data)
                        .service(get_user_nfts)
                        
                })
                .bind(("127.0.0.1", 8080))
                .unwrap()
                .run()
                .await
                .unwrap();
            });

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("Error while running Metaloot application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::Ready => {
                println!("Window loaded");
                GLOBAL_APP_HANDLE
                    .set(_app_handle.clone())
                    .expect("Failed to set global app handle");
            }
            _ => {}
        })
}
