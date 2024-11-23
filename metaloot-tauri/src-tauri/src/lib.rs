use actix_web::web;
// Add these imports at the top of the file
use actix_web::{get, post, App, HttpResponse, HttpServer, Responder};
use once_cell::sync::Lazy;
use once_cell::sync::OnceCell;
use serde_json::Value;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, WebviewUrl, WebviewWindowBuilder};

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

static GLOBAL_TRANSACTIONS: Lazy<Mutex<Vec<String>>> = Lazy::new(|| Mutex::new(Vec::new()));


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
            Some(user_data) => serde_json::to_string(&user_data)
                .map_err(|e| format!("Failed to serialize user data: {}", e)),
            None => Err("No user data found".to_string()),
        }
    }();

    match result {
        Ok(json) => HttpResponse::Ok()
            .content_type("application/json")
            .body(json),
        Err(e) => HttpResponse::InternalServerError().body(e),
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
            Some(user_data) => serde_json::to_string(&user_data)
                .map_err(|e| format!("Failed to serialize user nft data: {}", e)),
            None => Err("No user data nft found".to_string()),
        }
    }();

    match result {
        Ok(json) => HttpResponse::Ok()
            .content_type("application/json")
            .body(json),
        Err(e) => HttpResponse::InternalServerError().body(e),
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

#[post("/item/add")]
async fn add_item(item: web::Json<serde_json::Value>) -> impl Responder {
    println!("/item/add with payload: {:?}", item);
    GLOBAL_APP_HANDLE
        .get()
        .unwrap()
        .emit("add-item", item.into_inner())
        .unwrap();
    HttpResponse::Ok().finish()
}

#[tauri::command]
fn store_user_data(user_data: String) -> Result<(), String> {
    println!("{:#?} storing user data", user_data);

    let user_data: UserData = serde_json::from_str(&user_data).map_err(|e| {
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

    let user_nft_data: Vec<UserNFTData> = serde_json::from_str(&user_nft_data).map_err(|e| {
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
        Some(user_data) => serde_json::to_string(&user_data)
            .map_err(|e| format!("Failed to serialize user data: {}", e)),
        None => Err("No user data found".to_string()),
    }
}

#[tauri::command]
fn update_completed() -> Result<(), String> {
    let mut completed = NFT_UPDATE_COMPLETED.lock().unwrap();
    *completed = true;
    Ok(())
}

#[tauri::command]
fn store_transaction(transaction: String) -> Result<(), String> {
    println!("Storing transaction: {}", transaction);

    let mut transactions = GLOBAL_TRANSACTIONS
        .lock()
        .map_err(|_| "Failed to lock global transactions".to_string())?;

    transactions.push(transaction);
    Ok(())
}

#[tauri::command]
fn get_transactions() -> Result<Vec<String>, String> {
    let transactions = GLOBAL_TRANSACTIONS
        .lock()
        .map_err(|_| "Failed to lock global transactions".to_string())?;

    Ok(transactions.clone())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // tauri::Builder::default()
    // .plugin(tauri_plugin_localhost::Builder::new(todo!()).build())
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
        // .plugin(tauri_plugin_localhost::Builder::new(todo!()).build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![
            store_user_data,
            get_user_data_from_store,
            store_user_nft_data,
            update_completed,
            store_transaction,
            get_transactions
        ])
        .setup(move |app| {
            app.handle();
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
