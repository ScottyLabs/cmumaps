use lambda_http::{http::Method, Body, Error, Request, Response};

use serde_json;

use crate::graph_utils::{find_path, types::{Buildings, Graph, NodesRoute, Waypoints}, waypoint_to_nodes};


/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
pub(crate) async fn function_handler(event: Request, graph: &Graph, buildings: &Buildings) -> Result<Response<Body>, Error> {
    // Extract some useful information from the request
    // println!("{:?}", event);
    if event.method() == Method::OPTIONS {
        let resp = Response::builder()
            .status(200)
            .header("content-type", "text/json")
            .header("Access-Control-Allow-Origin", "*")
            .body("Cors is happy".into())
            .map_err(Box::new)?;
        return Ok(resp)
    }

    let waypoints_body = event.body();
    let waypoints_str = match waypoints_body {
        Body::Text(b) => b,
        Body::Empty => panic!("Request body is empty"),
        Body::Binary(_) => panic!("Request body is binary")
    };
    let waypointswaypoints: Waypoints = serde_json::from_str(waypoints_str).expect("Unable to parse request json");
    let waypoints = waypointswaypoints.waypoints;
    
    let start_waypoint = waypoints[0].clone();
    let end_waypoint = waypoints[1].clone();
    
    let start_nodes = waypoint_to_nodes(start_waypoint, &graph, &buildings);
    let end_nodes = waypoint_to_nodes(end_waypoint, &graph, &buildings);
    let route = find_path(&start_nodes, &end_nodes, &graph, 1.0).unwrap();
    let more_indoor_route = find_path(&start_nodes, &end_nodes, &graph, 100000.0).unwrap();
    let nodes_route =  NodesRoute {
        path: route.path.path.iter().map(|node_id| (&graph[node_id]).clone()).collect(),
        distance: route.distance.to_f32() - route.path.add_cost.parse::<f32>().unwrap()
    };
    let more_indoor_nodes_route = NodesRoute {
        path: more_indoor_route.path.path.iter().map(|node_id| (&graph[node_id]).clone()).collect(),
        distance: more_indoor_route.distance.to_f32() - more_indoor_route.path.add_cost.parse::<f32>().unwrap()
    };
    let response_obj = match (more_indoor_nodes_route.distance - nodes_route.distance > 10.0) {
        true => vec![nodes_route, more_indoor_nodes_route],
        false => vec![nodes_route]
    };
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