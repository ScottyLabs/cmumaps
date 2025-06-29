use std::sync::Arc;

use axum::http::Method;
use tower_http::cors::{Any, CorsLayer};

use axum::{
    routing::get,
    Router,
};

use dotenv::dotenv;

#[tokio::main]
async fn main() {
    // // specify the path to the documents from .env
    dotenv().ok();
    let data_path = std::env::var("DATA_PATH").expect("DATA_PATH must be set");

    let buildings_path = format!("{}/floorplans/buildings.json", data_path);
    let floorplans_path = format!("{}/floorplans/floorplans.json", data_path);

    let (index, documents) = search::build::build_search_index(
        buildings_path,
        floorplans_path,
    );

    let docs_path = format!("{}/documents.json", data_path);
    let index_path = format!("{}/search_index.json", data_path);

    // add state
    let app_state = search::types::AppState {
        docs: Arc::new(documents),
        index: Arc::new(index)
    };

    // init cors middleware
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    println!("Loaded {} documents", app_state.docs.len());

    // build our application with a single route
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/search", get(search::search))
        .route("/path", get(path::path))
        .layer(cors)
        .with_state(app_state);

    // run our app with hyper, listening globally on port FAST = 3278
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3278").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}