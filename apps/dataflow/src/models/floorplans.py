"""Pydantic models for floorplans.json schema."""

from __future__ import annotations

from typing import TYPE_CHECKING

from pydantic import BaseModel, ConfigDict, Field, RootModel

if TYPE_CHECKING:
    from models._common import Floor, GeoCoordinate


class Room(BaseModel):
    """A room in a building floor."""

    model_config = ConfigDict(extra="forbid")

    name: str
    label_position: GeoCoordinate = Field(alias="labelPosition")
    type: str
    id: str
    floor: Floor
    coordinates: list[list[GeoCoordinate]]
    aliases: list[str] | None = None


class Floorplans(RootModel[dict[str, dict[str, dict[str, Room]]]]):
    """Root model for floorplans.json.

    Structure: building_code -> floor_level -> room_uuid -> Room
    """
