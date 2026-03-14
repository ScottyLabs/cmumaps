"""Generate a simplified building code-to-info mapping.

Reads the full buildings.json and produces a lightweight mapping from
building code to name and default floor for quick lookups.

Input:
    - buildings.json: Full building data with osmId and name mappings

Output:
    - building_info_map.json: Simplified {code: {name, code, defaultFloor}} mapping
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from logger import get_app_logger

logger = get_app_logger()

# Input
BUILDINGS_JSON = os.environ.get(
    "CMUMAPS_DOWNLOADED_BUILDINGS_JSON",
    "buildings.json",
)

# Output
BUILDING_MAPPING_OUTPUT_JSON = os.environ.get(
    "CMUMAPS_BUILDING_MAPPING_OUTPUT",
    "building_info_map.json",
)


def main() -> None:
    """Read buildings.json and write building_info_map.json."""
    buildings_path = Path(BUILDINGS_JSON)
    try:
        with buildings_path.open(encoding="utf-8") as f:
            downloaded_buildings = json.load(f)
    except FileNotFoundError:
        logger.exception("Could not find %s", buildings_path)
        sys.exit(1)
    except json.JSONDecodeError:
        logger.exception("Invalid JSON in %s", buildings_path)
        sys.exit(1)

    building_info_map: dict[str, dict[str, str]] = {}
    for code, data in downloaded_buildings.items():
        building_info_map[code] = {
            "name": data.get("name", ""),
            "code": code,
            "defaultFloor": data.get("defaultFloor", "1"),
        }

    output_path = Path(BUILDING_MAPPING_OUTPUT_JSON)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(building_info_map, f, indent=4)

    logger.info(
        "Wrote building info map for %d buildings to %s",
        len(building_info_map),
        output_path,
    )


if __name__ == "__main__":
    main()
