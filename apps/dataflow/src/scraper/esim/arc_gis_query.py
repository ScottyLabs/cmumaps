"""Fetch CMU building metadata from the ArcGIS campus layer.

This script queries CMU's public ArcGIS building layer to retrieve official
building information including names, codes, and FMS identifiers.

Input:
    - None (fetches from CMU ArcGIS layer ID: 0a8e645dc06d43f1b197b2ea2c2b876e)

Output:
    - query.json: Raw ArcGIS feature data with building attributes
"""

import json
from pathlib import Path

from arcgis.gis import GIS  # type: ignore[import-untyped]

LAYER_ID = "0a8e645dc06d43f1b197b2ea2c2b876e"
FIELDS = [
    "Building_ID",
    "Long_Name",
    "Short_Name",
    "Sign_Abbrev",
    "BuildingID_Numeric_2",
    "Floor_Count",
    "Building_Address",
]


def _fetch_buildings(output_path: Path = Path("query.json")) -> int:
    """Fetch building data from ArcGIS and save to JSON."""
    import logging

    logger = logging.getLogger(__name__)

    try:
        portal = GIS()
    except Exception:
        logger.exception("Failed to connect to ArcGIS")
        return 0

    item = portal.content.get(LAYER_ID)
    if item is None:
        logger.error("ArcGIS layer not found: %s", LAYER_ID)
        return 0

    if not hasattr(item, "layers") or not item.layers:
        logger.error("ArcGIS item has no layers: %s", LAYER_ID)
        return 0

    layer = item.layers[0]

    try:
        results = layer.query(where="ZIP = 15213", out_fields=FIELDS)
    except Exception:
        logger.exception("Failed to query ArcGIS layer")
        return 0

    def clean(val: object) -> object:
        return val.strip() if isinstance(val, str) else val

    data = {
        "features": [
            {"attributes": {k: clean(f.attributes.get(k)) for k in FIELDS}}
            for f in results.features
        ],
    }

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    return len(data["features"])


def _parse_args() -> Path:
    """Parse command line arguments."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Fetch CMU building data from ArcGIS.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("query.json"),
        help="Path to write the query results (default: query.json).",
    )
    return parser.parse_args().output


if __name__ == "__main__":
    _fetch_buildings(_parse_args())
