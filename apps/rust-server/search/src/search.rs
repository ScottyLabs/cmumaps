use std::{collections::HashMap};

pub mod types;
pub mod parse;
pub mod build;
mod rank;
use axum::{
    debug_handler, extract::{Query, State}, Json
};

#[debug_handler]
pub async fn search(Query(_params): Query<types::SearchParams>, state: State<types::AppState>) -> Json<Vec<types::Document>> {
    let start_time = std::time::Instant::now();
    let docs = &state.docs;
    let index = &state.index;
    let query = parse::parse_query(&_params.query);
    let pos = _params.pos;
    let n = _params.n.unwrap_or(20);
    let num_docs = docs.len() as u16;

    let mut avg_dl = 0.0;
    for doc in docs.values() {
        avg_dl += rank::get_num_terms(doc) as f32;
    }
    avg_dl /= num_docs as f32;
    let mut overall_scores = HashMap::new();

    println!("Starting search for query: {:?} at time {:?}", query, start_time.elapsed());

    for word in query {
        // start timer
        

        let res = index.get(&word);
        if res.is_some() {
            let rel_docs: &Vec<(String, u16)> = res.unwrap();
            if rel_docs.is_empty() {
                continue;
            }
            let doc_freq = docs.len() as u16;
            let scored_docs = rel_docs.iter().map(|(doc_id, term_freq)| {
                let doc = docs.get(doc_id).unwrap();

                let doc_len = rank::get_num_terms(doc);
                (doc_id.clone(), rank::BM_25_term(*term_freq, doc_len, doc_freq, num_docs, avg_dl)) // Hack to prioritize (but not require) having all terms
            }).collect::<Vec<(String, f32)>>();

            for (doc_id, score) in &scored_docs {
                overall_scores.entry(doc_id.clone()).and_modify(|e| *e += score).or_insert(*score);
            }

        }
        println!("Processed word '{}' at {:?}", word, start_time.elapsed());
    }
    let sort_as_tupvec = overall_scores.iter().map(
        |(doc_id, score)| (doc_id.clone(), match docs.get(doc_id).unwrap() {
            types::Document::Room(room) => rank::distance_weighted_score(&room, pos.as_ref(), *score),
            _ => *score
        }
    )).collect::<Vec<(String, f32)>>();
    let mut res_n = rank::top_n(&sort_as_tupvec, n);

    res_n.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    println!("Overall scores calculated at {:?}", start_time.elapsed());

    return Json(res_n.iter().map(|(doc_id, _)| docs.get(doc_id).unwrap().clone()).collect());
}
