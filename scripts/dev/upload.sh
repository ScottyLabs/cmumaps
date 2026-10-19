#!/usr/bin/env bash
# Container-only helper: upload only known dataset files, never a whole archive.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
if [[ ! -f /.dockerenv || $# -lt 1 || $# -gt 2 ]]; then
  echo "Use scripts/dev/dev.py upload DIRECTORY [--include-pois] on your host." >&2
  exit 1
fi
if [[ -n "${2:-}" && "$2" != "--include-pois" ]]; then
  echo "Unknown upload option: $2" >&2
  exit 1
fi
exec devenv shell -- bash -c '
  set -euo pipefail
  [[ "$S3_ENDPOINT" == "http://localhost:9000" && "$S3_BUCKET" == "maps" ]]
  names=(buildings.json floorplans.json placements.json all-graph.json)
  if [[ "${2:-}" == "--include-pois" ]]; then names+=(osm-pois.json); fi
  for name in "${names[@]}"; do
    [[ -f "$1/$name" ]] || { echo "Missing input: $1/$name" >&2; exit 1; }
  done
  for name in "${names[@]}"; do
    echo "Uploading floorplans/$name to local Garage..."
    curl --fail --silent --show-error --retry 2 \
      --aws-sigv4 "aws:amz:${S3_REGION}:s3" \
      --user "${S3_ACCESS_KEY}:${S3_SECRET_KEY}" \
      --upload-file "$1/$name" \
      "${S3_ENDPOINT}/${S3_BUCKET}/floorplans/$name"
  done
' bash "$@"
