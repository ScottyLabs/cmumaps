"""Add FMS building identifiers to parsed building data.

This script adds FMS (Facility Management System) identifiers to parsed building
records by matching building codes and names against a sign abbreviation mapping.

Input:
    - buildings.json: Building data with osmId, name, code fields
    - sign_abbrev_mapping.json: Mapping from sign abbreviations to FMS IDs

Output:
    - buildings.json: Updated in-place with fmsId field added to each building
"""

from __future__ import annotations

import argparse
import json
import re
from collections import OrderedDict
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from collections.abc import Iterable


def _load_json(path: Path) -> dict:
    """Load JSON from file."""
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def _write_json(path: Path, data: dict) -> None:
    """Write JSON to file."""
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=4, ensure_ascii=False)
        handle.write("\n")


def _candidate_labels(code: str | None, name: str | None) -> Iterable[str]:
    """Generate potential lookup keys for the mapping."""
    seen: dict[str, None] = OrderedDict()

    def push(value: str | None) -> None:
        if not value:
            return
        cleaned = value.strip()
        if cleaned and cleaned not in seen:
            seen[cleaned] = None

    push(code)
    if code:
        push(code.upper())

    if name:
        push(name)
        push(name.upper())
        tokens = [tok for tok in re.split(r"[^A-Za-z0-9]+", name.upper()) if tok]
        if tokens:
            push(tokens[0])
        if len(tokens) > 1:
            push("".join(tokens[:2]))

    return seen.keys()


def _lookup_fms_id(
    mapping_upper: dict[str, dict[str, int]],
    code: str | None,
    name: str | None,
) -> int | None:
    """Return the BuildingID_Numeric_2 using sign_abbrev_mapping."""
    for label in _candidate_labels(code, name):
        entry = mapping_upper.get(label.upper())
        if entry:
            return entry["BuildingID_Numeric_2"]
    return None


def _insert_fms_field(
    building: dict[str, object],
    fms_id: int,
) -> dict[str, object]:
    """Insert fmsId immediately after osmId in the given building record."""
    updated: dict[str, object] = OrderedDict()
    for key, value in building.items():
        updated[key] = value
        if key == "osmId":
            updated["fmsId"] = fms_id
    if "osmId" not in updated and "fmsId" not in updated:
        updated["fmsId"] = fms_id
    return updated


def _parse_args() -> argparse.Namespace:
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Add fmsId to parsed buildings using sign_abbrev_mapping.json.",
    )
    parser.add_argument(
        "--buildings",
        type=Path,
        default=Path("buildings.json"),
        help="Path to the downloaded buildings JSON.",
    )
    parser.add_argument(
        "--mapping",
        type=Path,
        default=Path("sign_abbrev_mapping.json"),
        help="Path to sign_abbrev_mapping JSON.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Compute updates without writing changes.",
    )
    return parser.parse_args()


def main() -> None:
    """Run the FMS ID addition script."""
    args = _parse_args()

    mapping = _load_json(args.mapping)
    buildings = _load_json(args.buildings)
    mapping_upper = {key.upper(): value for key, value in mapping.items()}

    updated_buildings: dict[str, dict[str, object]] = OrderedDict()

    for code, payload in buildings.items():
        fms_id = _lookup_fms_id(
            mapping_upper,
            payload.get("code") or code,
            payload.get("name"),
        )
        has_fms = "fmsId" in payload

        if fms_id is not None:
            if has_fms and payload["fmsId"] == fms_id:
                updated_buildings[code] = payload
            else:
                updated_buildings[code] = _insert_fms_field(payload, fms_id)
        else:
            updated_buildings[code] = payload

    if not args.dry_run:
        _write_json(args.buildings, updated_buildings)


if __name__ == "__main__":
    main()
