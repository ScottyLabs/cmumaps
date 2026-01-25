"""Pydantic models for placements.json schema."""

from __future__ import annotations

from typing import TYPE_CHECKING

from pydantic import BaseModel, ConfigDict, Field, RootModel

if TYPE_CHECKING:
    from models._common import GeoCoordinate, LocalPosition


class Placement(BaseModel):
    """Placement information for a floor."""

    model_config = ConfigDict(extra="forbid")

    center: GeoCoordinate
    scale: float
    angle: float
    pdf_center: LocalPosition = Field(alias="pdfCenter")


class Placements(RootModel[dict[str, dict[str, Placement]]]):
    """Root model for placements.json.

    Structure: building_code -> floor_level -> Placement
    """
