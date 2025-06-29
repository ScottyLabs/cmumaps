use regex::Regex;
use crate::types;

pub fn top_n(rank_list: &Vec<(String, f32)>, n: usize) -> Vec<(String, f32)> {
    if rank_list.len() <= n {
        return rank_list.clone();
    }
    rank_list.iter().map(|x| vec![x]).reduce(|mut acc, x| {
        acc.push(x[0]);
        if acc.len() > n {
            acc.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
            acc.pop();
        }
        acc
    }).unwrap().iter().map(|x| x.clone().clone()).collect()
}

pub fn BM_25_term(term_freq: u16, doc_len: u16, doc_freq: u16, num_docs: u16, avg_dl: f32) -> f32 {
    let k = 1.2;
    let b = 0.2;
    let dl = doc_len as f32;
    let tf = term_freq as f32;
    let df = doc_freq as f32;
    let n = num_docs as f32;
    let idf_part = (((n - df + 0.5) / (df + 0.5))+1.0).ln();
    let tf_part = (tf * (k + 1.0)) / (tf + k * (1.0 - b + b * dl / avg_dl));
    idf_part * tf_part
}

pub fn trigrams(s: &str) -> Vec<String> {
    let s = format!("#{}#", s);
    let mut trigrams = vec![];
    for i in 0..s.len() - 2 {
        trigrams.push(s[i..i+3].to_string());
    }
    return trigrams;
}

pub fn identity(x: &str) -> String {
    return x.to_string();
}

pub fn parse_query(query: &String) -> Vec<String> {
    let nonalphanumre = Regex::new(r"[^a-zA-Z0-9 ]").unwrap();
    let split_query = nonalphanumre.split(&query);
    for i in split_query{
        println!("Split query: {:?}", i);
    }
    let split_query = nonalphanumre.split(&query);
    let trigrams = split_query.flat_map(|x| trigrams(x)).collect::<Vec<String>>();
    println!("Trigrams: {:?}", trigrams);
    return trigrams
}

pub fn coord_dist(a: &types::Coordinate, b: &types::Coordinate) -> f32 {
    let latitude_ratio = 111318.8450631976;
    let longitude_ratio = 84719.3945182816;

    let x_diff = (a.latitude - b.latitude) * latitude_ratio;
    let y_diff = (a.longitude - b.longitude) * longitude_ratio;
    return (x_diff.powf(2.0) + y_diff.powf(2.0)).sqrt();
}

pub fn distance_weighted_score(a: &types::RoomDocument, b: Option<&types::Coordinate>, score: f32) -> f32 {
    if b.is_none() || a.label_position.is_none() {
        return score;
    }
    let usr_pos = b.unwrap();
    let loc_pos = a.label_position.clone().unwrap();
    let dist = coord_dist(usr_pos, &loc_pos);
    return score + 1.0/((dist + 10.0).ln()+1.0);
}

pub fn get_num_terms(doc: &types::Document) -> u16 {
    match doc {
        types::Document::Room(room) => room.num_terms,
        types::Document::Carnival(carnival) => carnival.num_terms,
        types::Document::Course(course) => course.num_terms
    }
}
