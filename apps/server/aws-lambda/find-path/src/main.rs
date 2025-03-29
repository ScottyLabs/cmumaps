use lambda_http::{run, service_fn, tracing, Error};
mod http_handler;
use http_handler::function_handler;
use include_assets::{NamedArchive, include_dir};

mod graph_utils;

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();
    let archive = NamedArchive::load(include_dir!("assets"));
    let graph_parse_result = graph_utils::parse_graph(&archive, "all_graph.json");
    let graph = graph_parse_result.unwrap();
    let buildings_parse_result = graph_utils::parse_buildings(&archive, "buildings.json");
    let buildings = buildings_parse_result.expect("Invalid buildings json");
    println!("Completed Parsing Graph and Buildings successfully!");

    run(service_fn(|request| function_handler(request, &graph, &buildings))).await
}
