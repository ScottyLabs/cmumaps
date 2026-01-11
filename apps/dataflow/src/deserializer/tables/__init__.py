"""Functions to populate each table in the database."""

from .alias import populate_alias_table
from .building import populate_building_table
from .edge import populate_edge_table
from .floor import populate_floor_table
from .node import populate_node_table
from .room import populate_room_table

__all__ = [
    "populate_alias_table",
    "populate_building_table",
    "populate_edge_table",
    "populate_floor_table",
    "populate_node_table",
    "populate_room_table",
]
