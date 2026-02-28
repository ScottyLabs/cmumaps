"""find_neighbors.py - Room Neighbor Relationship Extractor.

WHAT IT DOES
------------
Analyses the raw CMU navigation graph to discover which rooms are adjacent
(i.e. connected by at least one navigation edge crossing a room boundary).
It then enriches the output with human-readable room names looked up from the
floor plan data, producing the neighbor JSON file consumed by the graph
builders.

HOW TO RUN
----------
    python find_neighbors.py

REQUIRED INPUT FILES
--------------------
  - downloaded_all-graph.json      (raw navigation graph exported from the CMU
                                    map API; each node contains a roomId and a
                                    neighbors dict)
  - downloaded_floorplans.json     (floor plan metadata: building -> floor ->
                                    room id -> room data with "name" field)

OUTPUT
------
  - room_neighbor_analysis_with_names.json   (used as input by
                                              generate_nodes.py and
                                              generate_code_simplified.py)

DEPENDENCIES
------------
  No third-party packages required (standard library only).
"""

import json
from collections import defaultdict
from pathlib import Path

# Read the all-graph.json file
with Path("downloaded_all-graph.json").open(encoding="utf-8") as f:
    all_graph = json.load(f)

print(f"Total nodes in graph: {len(all_graph)}")  # noqa: T201

# Dictionary to store room-to-room neighbor relationships
# Key: roomId, Value: set of neighbor roomIds
room_neighbors = defaultdict(set)


# Second pass: find neighbor relationships
for node_data in all_graph.values():
    # Skip nodes without roomId
    if "roomId" not in node_data or not node_data["roomId"]:
        continue

    current_room_id = node_data["roomId"]

    # Check each neighbor
    if "neighbors" in node_data:
        for neighbor_id in node_data["neighbors"]:
            neighbor_data = all_graph.get(neighbor_id)
            if neighbor_data is not None and neighbor_data.get("roomId"):
                neighbor_room_id = neighbor_data["roomId"]
                # Add bidirectional relationship (since graph might be directed)
                if current_room_id != neighbor_room_id:  # avoid self-loops
                    room_neighbors[current_room_id].add(neighbor_room_id)
                    room_neighbors[neighbor_room_id].add(current_room_id)

print(f"\nRoom-to-room neighbor relationships found: {len(room_neighbors)}")  # noqa: T201

# Convert sets to lists for JSON serialization
room_neighbors_list = {
    room_id: list(neighbors) for room_id, neighbors in room_neighbors.items()
}

# Read the floorplans.json file
with Path("downloaded_floorplans.json").open(encoding="utf-8") as f:
    floorplans = json.load(f)

# Create a mapping from room ID to room name
# Structure is: building -> floor -> room
room_id_to_name = {}
for building_code, building_data in floorplans.items():
    for floor_level, floor_data in building_data.items():
        for room_id, room_data in floor_data.items():
            room_id_to_name[room_id] = (
                f"{building_code}_{floor_level}_{room_data.get("name")}"
            )

# Convert room IDs to room names in the room_neighbors_list
# Fall back to room ID if name is missing or empty
room_neighbors_list_with_names = {}
for room_id, neighbors in room_neighbors_list.items():
    room_name = room_id_to_name.get(room_id)
    # If room name is empty or just whitespace, use the room ID instead
    if not room_name or not room_name.strip():
        room_name = room_id

    neighbor_names = []
    for neighbor_id in neighbors:
        neighbor_name = room_id_to_name.get(neighbor_id)
        # If neighbor name is empty or just whitespace, use the neighbor ID instead
        if not neighbor_name or not neighbor_name.strip():
            neighbor_name = neighbor_id
        neighbor_names.append(neighbor_name)

    room_neighbors_list_with_names[room_name] = neighbor_names


# Save the results with room IDs
output = {
    "statistics": {
        "total_nodes": len(all_graph),
        "rooms_with_neighbors": len(room_neighbors),
    },
    "room_neighbors": room_neighbors_list,
    "room_neighbors_names": room_neighbors_list_with_names,
}

with Path("room_neighbor_analysis_with_names.json").open("w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

print("Results with room names saved to 'room_neighbor_analysis_with_names.json'")  # noqa: T201
