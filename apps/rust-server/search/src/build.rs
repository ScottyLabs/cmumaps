use crate::build;
use crate::types;
use crate::parse;

fn insert_terms(index: &mut types::SearchIndex, terms: Vec<String>, doc_id: String) {
    let term_freqs = terms.into_iter().map(|term| (term, 1)).collect::<Vec<_>>();
    for (term, freq) in term_freqs {
        index.entry(term).or_insert_with(Vec::new).push((doc_id.clone(), freq));
    }
}

fn building_to_document(
    id: &str,
    name: &str,
    code: &str,
    label_position: &types::Coordinate,
) -> (types::RoomDocument, Vec<String>) {
    let mut doc = types::RoomDocument {
        id: id.to_string(),
        name_with_space: name.to_string(),
        full_name_with_space: name.to_string(),
        label_position: Some(label_position.clone()),
        _type: "building".to_string(),
        alias: code.to_string(),
        num_terms: 0, // Placeholder, will be updated later
    };

    // Update num_terms based on the number of trigrams in the name
    let terms = vec![parse::parse_query(&name.to_string()),
        (parse::parse_query(&code.to_string())),
        (parse::parse_query(&id.to_string())),
        (parse::parse_query(&doc.alias)),
        (parse::parse_query(&doc.name_with_space)),
        (parse::parse_query(&doc.full_name_with_space))
    ].concat();
    doc.num_terms = terms.len() as u16;

    (doc, terms)
}

fn room_to_document(
    id: &str,
    name: &str,
    building_name: &str,
    building_code: &str,
    alias: &str,
    label_position: &types::Coordinate,
) -> (types::RoomDocument, Vec<String>) {
    let mut doc = types::RoomDocument {
        id: id.to_string(),
        name_with_space: format!("{} {}", building_code, name),
        full_name_with_space: format!("{} {}", building_name, name),
        label_position: Some(label_position.clone()),
        _type: "room".to_string(),
        alias: alias.to_string(),
        num_terms: 0, // Placeholder, will be updated later
    };

    // Update num_terms based on the number of trigrams in the name
    let terms = vec![parse::parse_query(&name.to_string()),
        (parse::parse_query(&alias.to_string())),
        (parse::parse_query(&id.to_string())),
        (parse::parse_query(&doc.alias)),
        (parse::parse_query(&doc.name_with_space)),
        (parse::parse_query(&doc.full_name_with_space))
    ].concat();
    doc.num_terms = terms.len() as u16;

    (doc, terms)
}

pub fn build_search_index<P: AsRef<std::path::Path>, Q: AsRef<std::path::Path>>(
    buildings_path: P,
    floorplans_path: Q,
) -> (types::SearchIndex, types::Documents) {
    // start timer
    let start_time = std::time::Instant::now();

    // Parse buildings and floorplans with serde
    let buildings: types::Buildings = parse::parse_docs(buildings_path);
    let floorplans: types::FloorPlans = parse::parse_docs(floorplans_path);
    let mut index: types::SearchIndex = types::SearchIndex::new();
    // Create the documents
    let mut documents: types::Documents = types::Documents::new();
    for (id, building) in &buildings {
        let (building_doc, terms) = building_to_document(
            id,
            &building.name,
            &building.code,
            &building.label_position,
        );
        documents.insert(id.clone(), types::Document::Room(building_doc));
        insert_terms(&mut index, terms, id.clone());
    }
    println!("Built {} building documents", documents.len());
    // iterate over buildings
    for (building_id, floorplan) in &floorplans {
        let building_name = buildings.get(building_id)
            .map_or("Outside", |b| &b.name);
        let building_code = buildings.get(building_id)
            .map_or("OUT", |b| &b.code);
        // iterate over floors
        for (floor_id, floor) in floorplan {
            // iterate over rooms
            for (room_id, room) in floor {
                let (room_doc, terms) = room_to_document(
                    room_id,
                    &room.name,
                    &building_name,
                    &building_code,
                    &room.aliases.join(", "),
                    &room.label_position,
                );
                let doc_id = format!("{}-{}-{}", building_id, floor_id, room_id);
                documents.insert(doc_id.clone(), types::Document::Room(room_doc));
                insert_terms(&mut index, terms, doc_id);
            }
        }
        
    }
    println!("Built {} floorplan documents", documents.len());
    // Calculate elapsed time
    let elapsed_time = start_time.elapsed();
    println!("Search index built in {:.8?}", elapsed_time);
    (index, documents)
}