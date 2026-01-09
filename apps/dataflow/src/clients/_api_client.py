import os
from functools import lru_cache
from typing import Literal

import requests
from clerk_backend_api import Clerk

from logger import get_app_logger

type TableName = Literal[
    "Building",
    "Floor",
    "Room",
    "Alias",
    "Node",
    "Edge",
    "Poi",
]

ALL_TABLE_NAMES: list[TableName] = [
    "Building",
    "Floor",
    "Room",
    "Alias",
    "Node",
    "Edge",
    "Poi",
]


@lru_cache(maxsize=1)
def get_api_client_singleton() -> ApiClient:
    return ApiClient()


class ApiClient:
    TIMEOUT = 10

    def __init__(self) -> None:
        self.logger = get_app_logger()

        # Load required environment-specific variables
        self.server_url = os.getenv("SERVER_URL")
        self.machine_secret = os.getenv("CLERK_MACHINE_SECRET")

        if not self.server_url:
            msg = "SERVER_URL must be set"
            self.logger.critical(msg)
            raise ValueError(msg)

        if not self.machine_secret:
            msg = "CLERK_MACHINE_SECRET must be set"
            self.logger.critical(msg)
            raise ValueError(msg)

        # In-memory cached token
        self._cached_token = None

    def _get_token(self) -> str:
        if self._cached_token:
            return self._cached_token

        with Clerk(bearer_auth=self.machine_secret) as clerk:
            res = clerk.m2m.create_token()
            token = res.token

            # Cache in memory
            self._cached_token = token
            return token

    def drop_tables(self, table_names: list[TableName]) -> None:
        """Drop specified tables."""
        response = requests.delete(
            f"{self.server_url}/drop-tables",
            json={"tableNames": table_names},
            headers={"Authorization": f"Bearer {self._get_token()}"},
            timeout=self.TIMEOUT,
        )
        return response.json()
