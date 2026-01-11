"""Deserializer for the dataflow application.

Responsible for deserializing the JSON files from the S3 bucket
and populating the database with the data.
"""

from .main import main

__all__ = ["main"]
