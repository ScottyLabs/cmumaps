use axum::{Json, extract::Query};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct PathParams {
    pub start: String,
    pub end: String,
}

#[derive(Serialize)]
pub struct Floor {
    pub buildingCode: String,
    pub level: String,
}

#[derive(Serialize)]
pub struct Coordinate {
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(Serialize)]
pub struct NavNode {
    pub floor: Floor,
    pub coordinate: Coordinate,
    pub id: String,
    pub instruction: Option<String>,
}

#[derive(Serialize)]
pub struct PathResponse {
    pub fastest: Vec<NavNode>,
    pub outdoor: Option<Vec<NavNode>>,
    pub indoor: Option<Vec<NavNode>>,
}

pub async fn path(Query(_params): Query<PathParams>) -> Json<PathResponse> {
    Json(PathResponse {
        fastest: vec![
            NavNode {
                floor: Floor {
                    buildingCode: "CUC".to_string(),
                    level: "2".to_string(),
                },
                coordinate: Coordinate {
                    latitude: 40.44392022644891,
                    longitude: -79.94220130436851,
                },
                id: "node1".to_string(),
                instruction: Some("Start here".to_string()),
            },
            NavNode {
                floor: Floor {
                    buildingCode: "CUC".to_string(),
                    level: "2".to_string(),
                },
                coordinate: Coordinate {
                    latitude: 40.443950,
                    longitude: -79.942210,
                },
                id: "node2".to_string(),
                instruction: Some("Arrive".to_string()),
            },
        ],
        outdoor: None,
        indoor: None,
    })
}