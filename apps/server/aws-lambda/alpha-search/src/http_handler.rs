use lambda_http::{http::Method, Body, Error, Request, Response};
use search::types::{Coordinate, Document, Documents, SearchIndex};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct SearchRequest {
    query: String,
    location: Option<Coordinate>,
    n: Option<usize>,
}

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
pub(crate) async fn function_handler(event: Request, index: &SearchIndex, documents: &Documents) -> Result<Response<Body>, Error> {
    // CORS Options req (this is ok for performance because it is almost always followed by a real request, meaning we pre-warm the server for free)
    if event.method() == Method::OPTIONS {
        let resp = Response::builder()
            .status(200)
            .header("content-type", "text/json")
            .header("Access-Control-Allow-Origin", "*")
            .body("Cors is happy".into())
            .map_err(Box::new)?;
        return Ok(resp)
    }

    let body = event.body();
    let query = match body {
        Body::Text(b) => b,
        Body::Empty => return Ok(Response::builder()
        .status(200)
        .header("content-type", "text/json")
        .header("Access-Control-Allow-Origin", "*")
        .body("[]".into())
        .map_err(Box::new)?),
        Body::Binary(_) => panic!("Request body is binary")
    };
    
    let query_info = serde_json::from_str::<SearchRequest>(&query).unwrap();

    let n = query_info.n.unwrap_or(100);
    let vec_query = search::parse_query(&query_info.query);
    
    let response_obj = search::search(&vec_query, &index, &documents, None, n, query_info.location)
        .iter().map(|x| documents.get(x).unwrap()).collect::<Vec<&Document>>();
    let path_json = serde_json::to_string(&response_obj).unwrap_or("[]".to_string());

    // Return something that implements IntoResponse.
    // It will be serialized to the right response event automatically by the runtime
    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/json")
        .header("Access-Control-Allow-Origin", "*")
        .body(path_json.into())
        .map_err(Box::new)?;
    Ok(resp)
}
