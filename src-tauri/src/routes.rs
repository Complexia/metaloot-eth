use tauri::http::{Request, Response, ResponseBuilder};
use serde_json::json;
use super::AppState;

pub async fn handle_routes(req: Request, state: tauri::State<'_, AppState>) -> Response {
    match (req.method(), req.uri().path()) {
        // User routes
        ("GET", path) if path.starts_with("/user/") => {
            let address = path.trim_start_matches("/user/");
            match super::get_user_info(address.to_string(), state).await {
                Ok(response) => ResponseBuilder::new()
                    .status(200)
                    .body(serde_json::to_vec(&response).unwrap())
                    .unwrap(),
                Err(e) => ResponseBuilder::new()
                    .status(401)
                    .body(serde_json::to_vec(&json!({
                        "data": e,
                        "timestamp": chrono::Utc::now().to_rfc3339(),
                        "status": "error"
                    })).unwrap())
                    .unwrap(),
            }
        },

        // Item routes
        ("GET", path) if path.starts_with("/item/") && path.ends_with("/metadata") => {
            let item_id = path.trim_start_matches("/item/").trim_end_matches("/metadata");
            let user_address = req.headers()
                .get("X-User-Address")
                .and_then(|v| v.to_str().ok())
                .unwrap_or("");

            match super::get_item_metadata(item_id.to_string(), user_address.to_string(), state).await {
                Ok(response) => ResponseBuilder::new()
                    .status(200)
                    .body(serde_json::to_vec(&response).unwrap())
                    .unwrap(),
                Err(e) => ResponseBuilder::new()
                    .status(500)
                    .body(serde_json::to_vec(&json!({
                        "data": e,
                        "timestamp": chrono::Utc::now().to_rfc3339(),
                        "status": "error"
                    })).unwrap())
                    .unwrap(),
            }
        },

        // Game session routes
        ("POST", "/game/start") => {
            let user_address = req.headers()
                .get("X-User-Address")
                .and_then(|v| v.to_str().ok())
                .unwrap_or("");

            match super::start_game_session(user_address.to_string(), state).await {
                Ok(response) => ResponseBuilder::new()
                    .status(200)
                    .body(serde_json::to_vec(&response).unwrap())
                    .unwrap(),
                Err(e) => ResponseBuilder::new()
                    .status(500)
                    .body(serde_json::to_vec(&json!({
                        "data": e,
                        "timestamp": chrono::Utc::now().to_rfc3339(),
                        "status": "error"
                    })).unwrap())
                    .unwrap(),
            }
        },

        ("POST", path) if path.starts_with("/game/") && path.ends_with("/end") => {
            let session_id = path.trim_start_matches("/game/").trim_end_matches("/end");
            let user_address = req.headers()
                .get("X-User-Address")
                .and_then(|v| v.to_str().ok())
                .unwrap_or("");

            match super::end_game_session(session_id.to_string(), user_address.to_string(), state).await {
                Ok(response) => ResponseBuilder::new()
                    .status(200)
                    .body(serde_json::to_vec(&response).unwrap())
                    .unwrap(),
                Err(e) => ResponseBuilder::new()
                    .status(500)
                    .body(serde_json::to_vec(&json!({
                        "data": e,
                        "timestamp": chrono::Utc::now().to_rfc3339(),
                        "status": "error"
                    })).unwrap())
                    .unwrap(),
            }
        },

        // Default 404 response
        _ => ResponseBuilder::new()
            .status(404)
            .body(serde_json::to_vec(&json!({
                "data": "Route not found",
                "timestamp": chrono::Utc::now().to_rfc3339(),
                "status": "error"
            })).unwrap())
            .unwrap(),
    }
} 