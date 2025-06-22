use axum::{
    routing::get,
    Router,
};

#[tokio::main]
async fn main() {
    // // specify the path to the documents from .env
    // let data_path = std::env::var("DOCS_PATH").expect("DOCS_PATH must be set");
    // let docs_path = format!("{}/documents.json", data_path);
    // let index_path = format!("{}/search_index.json", data_path);

    // add state
    // let app_state = search::types::AppState {
    //     docs: search::parse::parse_docs(docs_path),
    //     index: search::parse::parse_index(index_path),
    // };

    // build our application with a single route
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }));
        // .route("/search", get(search::search))
        // .route("/path", get(path::path))
        // .with_state(app_state);

    // run our app with hyper, listening globally on port FAST = 3278
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3278").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}