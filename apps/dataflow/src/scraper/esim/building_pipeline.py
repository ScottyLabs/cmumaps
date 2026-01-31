"""Orchestrate the full ESIM building data pipeline.

This script runs all pipeline stages in sequence to generate complete
building data for CMU Maps from ArcGIS and OpenStreetMap sources.

Pipeline stages:
    1. arc_gis_query.py: Fetch building metadata from ArcGIS
    2. osm_building_to_json.py: Fetch OSM data and parse building
       geometries
    3. sign_abbrev_mapping.py: Create sign abbreviation to ID mapping
    4. add_fms_id.py: Enrich buildings with FMS identifiers

Input:
    - buildings.json: Existing building data with osmId mappings

Output:
    - query.json: Raw ArcGIS building data
    - sign_abbrev_mapping.json: Sign abbreviation to FMS ID mapping
    - buildings.json: Final building data with geometries and FMS IDs
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Run the building pipeline from ArcGIS/OSM to buildings.json",
    )
    parser.add_argument("--osm-file", type=Path, default=Path("export.osm"))
    parser.add_argument(
        "--downloaded-buildings",
        type=Path,
        default=Path("buildings.json"),
    )
    parser.add_argument("--output", type=Path, default=Path("buildings.json"))
    parser.add_argument(
        "--skip-arcgis",
        action="store_true",
        help="Skip ArcGIS fetch (use existing query.json)",
    )
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def _run(cmd: list[str], env: dict[str, str] | None = None) -> None:
    """Run a subprocess command."""
    subprocess.run(cmd, check=True, env=env)  # noqa: S603


def main() -> None:
    """Run the building pipeline."""
    args = parse_args()
    python = sys.executable
    script_dir = Path(__file__).parent

    # Resolve all paths to absolute
    osm_file = Path(args.osm_file).resolve()
    downloaded_buildings = Path(args.downloaded_buildings).resolve()
    output_file = Path(args.output).resolve()

    # Intermediate files stored in script directory
    query_json = (script_dir / "query.json").resolve()
    sign_mapping_json = script_dir / "sign_abbrev_mapping.json"
    sign_mapping_json = sign_mapping_json.resolve()

    # Step 1: Fetch from ArcGIS
    if not args.skip_arcgis:
        _run([python, str(script_dir / "arc_gis_query.py"), "--output",
              str(query_json)])

    # Step 2: Parse OSM buildings
    env = os.environ.copy()
    env["CMUMAPS_OSM_FILE"] = str(osm_file)
    env["CMUMAPS_DOWNLOADED_BUILDINGS_JSON"] = str(downloaded_buildings)
    env["CMUMAPS_PARSED_BUILDINGS_OUTPUT"] = str(output_file)
    _run([python, str(script_dir / "osm_building_to_json.py")], env=env)

    # Step 3: Build sign mapping
    _run([
        python,
        str(script_dir / "sign_abbrev_mapping.py"),
        "--query", str(query_json),
        "--output", str(sign_mapping_json),
    ])

    # Step 4: Add FMS IDs
    cmd = [
        python,
        str(script_dir / "add_fms_id.py"),
        "--buildings", str(output_file),
        "--mapping", str(sign_mapping_json),
    ]
    if args.dry_run:
        cmd.append("--dry-run")
    _run(cmd)


if __name__ == "__main__":
    main()
