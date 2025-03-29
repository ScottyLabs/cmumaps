use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub type SearchIndex = HashMap<String, Vec<(String, u8)>>;
pub type Documents = HashMap<String, Document>;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Document {
    pub id: String,
    pub name_with_space: String,
    pub full_name_with_space: String,
    pub label_position: Option<Coordinate>,
    #[serde(rename(deserialize = "type"), alias = "type")]
    pub _type: String, // serde treat as type
    pub alias: String,
    pub num_terms: u16,
    pub floor: Floor
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Floor {
    #[serde(alias = "buildingCode")]
    pub building_code: String, 
    pub level: String
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Coordinate {
    pub latitude: f64,
    pub longitude: f64,
}