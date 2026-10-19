#!/usr/bin/env bash
set -euo pipefail

# OpenBao authentication and downloads happen on the host via dev:container.
bash /workspace/scripts/dev/container-app.sh --dependencies-only
