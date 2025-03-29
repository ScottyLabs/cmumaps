use include_assets::{NamedArchive, include_dir};

use lambda_http::{run, service_fn, tracing, Error};
mod http_handler;
use http_handler::function_handler;

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();

    let archive = NamedArchive::load(include_dir!("bin_assets"));
    
    let index_path = "searchIndex.bin";
    let docs_path = "searchDocuments.bin";

    let index_bin = archive.get(index_path).expect("Could not read index");
    let docs_bin = archive.get(docs_path).expect("Could not read docs");

    let index: search::types::SearchIndex = bincode::deserialize(&index_bin).expect("Invalid index");
    let docs: search::types::Documents = bincode::deserialize(&docs_bin).expect("Invalid docs");

    run(service_fn(|x| function_handler(x, &index, &docs))).await
}
