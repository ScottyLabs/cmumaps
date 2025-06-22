use serde::{Deserialize, Serialize};
use std::{collections::HashMap};


#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(untagged)]
pub enum Document {
    Room(RoomDocument),
    Carnival(CarnivalDocument),
    Course(CourseDocument),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SearchParams {
    pub query: String,
    pub n: Option<usize>,
    pub pos: Option<Coordinate>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppState {
    pub docs: Documents,
    pub index: SearchIndex,
}

pub type SearchIndex = HashMap<String, Vec<(String, u16)>>;

pub type CourseDocuments = HashMap<String, CourseDocument>;

pub type CarnivalDocuments = HashMap<String, CarnivalDocument>;
pub type RoomDocuments = HashMap<String, RoomDocument>;

pub type Documents = HashMap<String, Document>;
#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RoomDocument {
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


#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CarnivalDocument {
    pub description: Option<String>,
    pub start_date_time: Option<String>,
    pub end_date_time: Option<String>,
    pub title: String,
    pub event_id: String,
    pub location_id: String,
    pub location_name: String,
    pub latitude: f32,
    pub longitude: f32,
    pub req: String,
    pub tracks: Vec<String>,
    pub tag: String,
    pub num_terms: u16
}


#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CourseDocument {
    #[serde(alias = "_id")]
    pub id: oid,
    #[serde(alias = "courseID")]
    pub course_id: String,
    pub desc: String,
    pub prereqs: Vec<String>,
    pub prereq_string: String,
    pub coreqs: Vec<String>,
    pub crosslisted: Vec<String>,
    pub name: String,
    pub units: String,
    pub department: String,
    pub num_terms: u16
}


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct oid {
    #[serde(rename = "$oid")]
    pub oid: String
}


#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Floor {
    #[serde(alias = "buildingCode")]
    pub building_code: String, 
    pub level: String
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub struct Coordinate {
    pub latitude: f32,
    pub longitude: f32,
}