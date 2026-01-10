import os
from functools import lru_cache
from typing import Literal

import requests

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
    SUCCESS_STATUS_CODE = 200

    TOKEN_URL = (
        "https://idp.scottylabs.org/realms/scottylabs/protocol/openid-connect/token"  # noqa: S105
    )

    def __init__(self) -> None:
        self.logger = get_app_logger()

        # Load required environment-specific variables
        self.server_url = os.getenv("SERVER_URL")
        self.auth_client_id = os.getenv("AUTH_CLIENT_ID")
        self.auth_client_secret = os.getenv("AUTH_CLIENT_SECRET")

        if not self.server_url:
            msg = "SERVER_URL must be set"
            self.logger.critical(msg)
            raise ValueError(msg)

        if not self.auth_client_id or not self.auth_client_secret:
            msg = "AUTH_CLIENT_ID and AUTH_CLIENT_SECRET must be set"
            self.logger.critical(msg)
            raise ValueError(msg)

        # In-memory cached token
        self._cached_token = None

    def _get_token(self) -> str:
        if self._cached_token:
            return self._cached_token

        data = {
            "grant_type": "client_credentials",
            "client_id": self.auth_client_id,
            "client_secret": self.auth_client_secret,
        }

        response = requests.post(self.TOKEN_URL, data=data, timeout=self.TIMEOUT)
        response.raise_for_status()
        token_data = response.json()

        self._cached_token = token_data.get("access_token")
        if not self._cached_token:
            msg = "Failed to get token"
            self.logger.critical(msg)
            raise RuntimeError(msg)

        return self._cached_token

    def drop_tables(self, table_names: list[TableName]) -> bool:
        """Drop specified tables."""
        response = requests.delete(
            f"{self.server_url}/drop-tables",
            json={"tableNames": table_names},
            headers={"Authorization": f"Bearer {self._get_token()}"},
            timeout=self.TIMEOUT,
        )
        return response.status_code == self.SUCCESS_STATUS_CODE

    def populate_table(self, table_name: TableName, data: list[dict]) -> bool:
        """Populate a table with the given data."""
        response = requests.post(
            f"{self.server_url}/populate-table/{table_name}",
            json=data,
            headers={"Authorization": f"Bearer {self._get_token()}"},
            timeout=self.TIMEOUT,
        )

        if response.status_code != self.SUCCESS_STATUS_CODE:
            msg = f"Failed to populate {table_name} table: {response.json()}"
            raise RuntimeError(msg)

        return True
