use regex::Regex;
use serde::de::DeserializeOwned;
use std::error::Error;
use std::io::BufReader;
use std::{path::Path};
use std::fs::File;

use crate::types;

pub fn parse_index<P: AsRef<Path>>(idx_path: P) -> types::SearchIndex {
    let idx_json_file = File::open(idx_path)
        .expect("Failed to open index file");
    let idx_json_reader = BufReader::new(idx_json_file);
    let idx = serde_json::from_reader(idx_json_reader).expect("Failed to parse index file");
    idx
}

pub fn parse_docs<P: AsRef<Path>, T>(path: P) -> T
where 
    T: DeserializeOwned,
{
    let json_file = File::open(path)
        .expect("Failed to open documents file");
    let json_reader = BufReader::new(json_file);
    let docs = serde_json::from_reader(json_reader)
        .expect("Failed to parse documents file");
    docs
}

fn trigrams(s: &str) -> Vec<String> {
    let s = format!("#{}#", s);
    let mut trigrams = vec![];
    for i in 0..s.len() - 2 {
        trigrams.push(s[i..i+3].to_string());
    }
    return trigrams;
}

pub fn parse_query(query: &String) -> Vec<String> {
    let nonalphanumre = Regex::new(r"[^a-zA-Z0-9 ]").unwrap();
    let split_query = nonalphanumre.split(&query);
    let trigrams = split_query.flat_map(|x| trigrams(x)).collect::<Vec<String>>();
    return trigrams
}