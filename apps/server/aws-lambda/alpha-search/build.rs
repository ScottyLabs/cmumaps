// Build script to generate bincode to load at super speed

use std::env;
use std::fs;
use std::path::Path;

use search::{parse_search_index, parse_docs};

fn main() {
    let out_dir = "./bin_assets";
    
    let docs = parse_docs("assets/searchDocuments.json").unwrap();
    let docs_bin = bincode::serialize(&docs).unwrap();

    let index = parse_search_index("assets/searchIndex.json").unwrap();
    let index_bin = bincode::serialize(&index).unwrap();

    let dest_path_docs = Path::new(&out_dir).join("searchDocuments.bin");
    let dest_path_index = Path::new(&out_dir).join("searchIndex.bin");

    fs::write(
        &dest_path_docs, docs_bin
    ).unwrap();
    fs::write(
        &dest_path_index, index_bin
    ).unwrap();

    println!("cargo::rerun-if-changed=assets/searchDocuments.json");
    println!("cargo::rerun-if-changed=assets/searchIndex.json");
}