"""Pydantic models for all-graph.json schema."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from pydantic import BaseModel, ConfigDict, Field, RootModel

if TYPE_CHECKING:
    from models._common import Floor, GeoCoordinate, LocalPosition


class NeighborConnection(BaseModel):
    """A connection to a neighboring node."""

    model_config = ConfigDict(extra="forbid")

    dist: float
    to_floor_info: dict[str, Any] | None = Field(default=None, alias="toFloorInfo")


class GraphNode(BaseModel):
    """A node in the navigation graph."""

    model_config = ConfigDict(extra="forbid")

    neighbors: dict[str, NeighborConnection]
    coordinate: GeoCoordinate
    floor: Floor
    id: str
    pos: LocalPosition | None = None
    room_id: str | None = Field(default=None, alias="roomId")


class Graph(RootModel[dict[str, GraphNode]]):
    """Root model for all-graph.json - maps node UUID to GraphNode."""
