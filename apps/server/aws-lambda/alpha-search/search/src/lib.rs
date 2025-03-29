use std::collections::HashMap;
use std::error::Error;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;

pub mod types;

pub fn parse_search_index<P: AsRef<Path>>(idx_path: P) -> Result<types::SearchIndex, Box<dyn Error>> {
    let idx_json_file = File::open(idx_path)?;
    let idx_json_reader = BufReader::new(idx_json_file);
    let idx = serde_json::from_reader(idx_json_reader)?;
    Ok(idx)
}

pub fn parse_docs<P: AsRef<Path>>(docs_path: P) -> Result<types::Documents, Box<dyn Error>> {
    let docs_json_file = File::open(docs_path)?;
    let docs_json_reader = BufReader::new(docs_json_file);
    let docs = serde_json::from_reader(docs_json_reader)?;
    Ok(docs)
}

fn top_n(rank_list: &Vec<(String, f64)>, n: usize) -> Vec<(String, f64)> {
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

fn tf_idf(term_freq: u8, doc_len: u16, doc_freq: u16, num_docs: u16) -> f64 {
    let dl = doc_len as f64;
    let tf = term_freq as f64;
    let df = doc_freq as f64;
    let n = num_docs as f64;
    (tf / (dl).powf(2.0)) * ((n) / (1.0+df)).ln()
}

fn trigrams(s: &str) -> Vec<String> {
    if s.len() < 3 {
        return vec![s.to_string()];
    }
    let mut trigrams = vec![];
    for i in 0..s.len() - 2 {
        trigrams.push(s[i..i+3].to_string());
    }
    return trigrams;
}

pub fn parse_query(query: &String) -> Vec<String> {
    let query = query.to_lowercase();
    if query.len() < 2 {
        return vec![];
    }
    if query.len() == 2 {
        return vec![query.to_string()];
    }
    let split_query = query.split(&[' ']);
    let trigrams = split_query.flat_map(|x| trigrams(x)).collect::<Vec<String>>();
    return trigrams
}

pub fn coord_dist(a: types::Coordinate, b: types::Coordinate) -> f64 {
    let latitude_ratio = 111318.8450631976;
    let longitude_ratio = 84719.3945182816;

    let x_diff = (a.latitude - b.latitude) * latitude_ratio;
    let y_diff = (a.longitude - b.longitude) * longitude_ratio;
    return (x_diff.powf(2.0) + y_diff.powf(2.0)).sqrt();
}

pub fn distance_weighted_score(a: &types::Document, b: Option<types::Coordinate>, score: f64) -> f64 {
    if b.is_none() || a.label_position.is_none() {
        return score;
    }
    let usr_pos = b.unwrap();
    let loc_pos = a.label_position.clone().unwrap();
    let dist = coord_dist(usr_pos, loc_pos);
    return score + 1.0/((dist + 10.0).ln()+1.0);
}

pub fn search(query: &Vec<String>, index: &types::SearchIndex, all_docs: &types::Documents, beam_width_opt: Option<u16>, n: usize, pos: Option<types::Coordinate>) -> Vec<String> {
    let num_docs = 9824;
    let mut overall_scores = HashMap::new();
    for word in query {
        let res = index.get(word);
        if res.is_some() {
            let docs: &Vec<(String, u8)> = res.unwrap();
            let doc_freq = docs.len() as u16;
            let mut scored_docs = docs.iter().map(|(doc_id, term_freq) | {
                let doc = all_docs.get(doc_id).unwrap();
                let doc_len = doc.num_terms;
                (doc_id.clone(), tf_idf(*term_freq, doc_len, doc_freq, num_docs) + 1000.0) // Hack to prioritize (but not require) having all terms
            }).collect::<Vec<(String, f64)>>();

            if let Some(beam_width) = beam_width_opt {
                scored_docs = top_n(&scored_docs, beam_width as usize);
            }

            for (doc_id, score) in &scored_docs {
                overall_scores.entry(doc_id.clone()).and_modify(|e| *e += score).or_insert(*score);
            }

        }
    }
    let sort_as_tupvec = overall_scores.iter().map(
        |(doc_id, score)| (doc_id.clone(), distance_weighted_score(all_docs.get(doc_id).expect("Bad problem"), pos.clone(), *score))
    ).collect::<Vec<(String, f64)>>();
    let mut res_n = top_n(&sort_as_tupvec, n);

    res_n.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    return res_n.iter().map(|(doc_id, _)| doc_id.clone()).collect();
}