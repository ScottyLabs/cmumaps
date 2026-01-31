"""Pydantic models for placements.json schema."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, RootModel

from models._common import GeoCoordinate, LocalPosition  # noqa: TC001


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
