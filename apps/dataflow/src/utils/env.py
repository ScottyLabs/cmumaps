"""Load dataflow `.env` files from the app root (next to `pyproject.toml`)."""

from pathlib import Path

import dotenv

_DATAFLOW_ROOT = Path(__file__).resolve().parent.parent.parent


def load_dataflow_dotenv() -> None:
    """Load `.env` then `.env.local` (local overrides)."""
    dotenv.load_dotenv(_DATAFLOW_ROOT / ".env")
    dotenv.load_dotenv(_DATAFLOW_ROOT / ".env.local", override=True)
