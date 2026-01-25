"""Pydantic models for buildings.json schema."""

from __future__ import annotations

from typing import TYPE_CHECKING

from pydantic import BaseModel, ConfigDict, Field, RootModel

if TYPE_CHECKING:
    from models._common import GeoCoordinate


class Building(BaseModel):
    """A building on campus."""

    model_config = ConfigDict(extra="forbid")

    name: str
    osm_id: str = Field(alias="osmId")
    floors: list[str]
    default_floor: str = Field(alias="defaultFloor")
    label_position: GeoCoordinate = Field(alias="labelPosition")
    shapes: list[list[GeoCoordinate]]
    fms_id: float | None = Field(default=None, alias="fmsId")
    hitbox: list[GeoCoordinate] | None
    code: str | None = None
    entrances: list | None = None
    default_ordinal: int | None = Field(default=None, alias="defaultOrdinal")


class Buildings(RootModel[dict[str, Building]]):
    """Root model for buildings.json - maps building code to Building."""
