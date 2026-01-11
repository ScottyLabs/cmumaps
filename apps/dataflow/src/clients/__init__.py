"""Singleton clients for the dataflow application."""

from ._api_client import ALL_TABLE_NAMES, TableName, get_api_client_singleton
from ._s3_client import get_s3_client_singleton

__all__ = [
    "ALL_TABLE_NAMES",
    "TableName",
    "get_api_client_singleton",
    "get_s3_client_singleton",
]
