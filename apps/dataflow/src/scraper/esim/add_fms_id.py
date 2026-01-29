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
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from collections.abc import Iterable

MappingEntry = dict[str, int | str]


def _load_json(path: Path) -> dict[str, Any]:
    """Load JSON from file."""
    with path.open(encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        msg = f"Unexpected JSON shape in {path}; expected an object."
        raise TypeError(msg)
    return {str(key): value for key, value in data.items()}


def _write_json(path: Path, data: dict[str, Any]) -> None:
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
    mapping_upper: dict[str, MappingEntry],
    code: str | None,
    name: str | None,
) -> int | None:
    """Return the BuildingID_Numeric_2 using sign_abbrev_mapping."""
    for label in _candidate_labels(code, name):
        entry = mapping_upper.get(label.upper())
        if entry:
            value = entry.get("BuildingID_Numeric_2")
            if isinstance(value, int):
                return value
            if isinstance(value, str) and value.isdigit():
                return int(value)
    return None


def _insert_fms_field(
    building: dict[str, object],
    fms_id: int,
) -> dict[str, object]:
    """Insert fmsId immediately after osmId in the given building record."""
    updated: dict[str, object] = OrderedDict()
    inserted = False
    for key, value in building.items():
        if key == "fmsId":
            continue  # Skip existing fmsId; we'll insert the new one
        updated[key] = value
        if key == "osmId":
            updated["fmsId"] = fms_id
            inserted = True
    if not inserted:
        updated["fmsId"] = fms_id
    return updated


def _parse_mapping(mapping_raw: dict[str, Any]) -> dict[str, MappingEntry]:
    """Parse and validate the mapping JSON structure."""
    mapping: dict[str, MappingEntry] = {}
    for key, value in mapping_raw.items():
        if not isinstance(value, dict):
            msg = f"Unexpected mapping entry for {key}; expected an object."
            raise TypeError(msg)
        entry: MappingEntry = {}
        for entry_key, entry_value in value.items():
            if isinstance(entry_value, (int, str)):
                entry[str(entry_key)] = entry_value
        mapping[str(key)] = entry
    return mapping


def _parse_buildings(buildings_raw: dict[str, Any]) -> dict[str, dict[str, object]]:
    """Parse and validate the buildings JSON structure."""
    buildings: dict[str, dict[str, object]] = {}
    for code, payload in buildings_raw.items():
        if not isinstance(payload, dict):
            msg = f"Unexpected building entry for {code}; expected an object."
            raise TypeError(msg)
        buildings[str(code)] = {str(k): v for k, v in payload.items()}
    return buildings


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

    mapping = _parse_mapping(_load_json(args.mapping))
    buildings = _parse_buildings(_load_json(args.buildings))
    mapping_upper = {key.upper(): value for key, value in mapping.items()}

    updated_buildings: dict[str, dict[str, object]] = OrderedDict()

    for code, payload in buildings.items():
        code_value = payload.get("code")
        name_value = payload.get("name")
        code_str = code_value if isinstance(code_value, str) else None
        name_str = name_value if isinstance(name_value, str) else None
        fms_id = _lookup_fms_id(mapping_upper, code_str or code, name_str)
        existing_fms = payload.get("fmsId")

        already_has_fms = isinstance(existing_fms, int) and existing_fms == fms_id
        if fms_id is not None and not already_has_fms:
            updated_buildings[code] = _insert_fms_field(payload, fms_id)
        else:
            updated_buildings[code] = payload

    if not args.dry_run:
        _write_json(args.buildings, updated_buildings)


if __name__ == "__main__":
    main()
