"""Validate source data before clearing any database tables."""

from clients import get_s3_client_singleton
from models import Poi


def validate_sources(*, skip_pois: bool) -> None:  # noqa: C901
    """Cache validated JSON and check the foreign keys used by the importer."""
    s3 = get_s3_client_singleton()
    buildings = s3.preload_json_file("floorplans/buildings.json")
    placements = s3.preload_json_file("floorplans/placements.json")
    floorplans = s3.preload_json_file("floorplans/floorplans.json")
    graph = s3.preload_json_file("floorplans/all-graph.json")
    floors = {(b, f) for b, fs in placements.items() if b != "outside" for f in fs}
    rooms = {
        key: room
        for b, fs in floorplans.items()
        if b != "outside"
        for rs in fs.values()
        for key, room in rs.items()
    }
    if any(b not in buildings for b, _ in floors):
        msg = "Placements reference a missing building"
        raise ValueError(msg)
    for key, room in rooms.items():
        floor = room["floor"]
        if key != room["id"] or (floor["buildingCode"], floor["level"]) not in floors:
            msg = f"Room {key} has an inconsistent ID or missing floor"
            raise ValueError(msg)
    for key, node in graph.items():
        floor = node["floor"]
        if floor["buildingCode"] == "outside":
            continue
        if (floor["buildingCode"], floor["level"]) not in floors:
            msg = f"Node {key} references a missing floor"
            raise ValueError(msg)
        if node.get("roomId") and node["roomId"] not in rooms:
            msg = f"Node {key} references a missing room"
            raise ValueError(msg)
    if not skip_pois:
        pois = s3.preload_json_file("floorplans/osm-pois.json")
        for data in pois.values():
            poi = Poi.model_validate(data)
            if (
                poi.building_code
                and poi.floor_level
                and (
                    poi.building_code,
                    poi.floor_level,
                )
                not in floors
            ):
                msg = f"POI {poi.poi_id} references a missing floor"
                raise ValueError(msg)
