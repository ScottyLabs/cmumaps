import json
import os
from functools import lru_cache
from pathlib import Path
from typing import Any, cast

from minio import Minio
from pydantic import BaseModel, ValidationError

from logger import get_app_logger
from models import Buildings, Floorplans, Graph, Placements

# Mapping of S3 object name patterns to their Pydantic validator models
SCHEMA_VALIDATORS: dict[str, type[BaseModel]] = {
    "buildings.json": Buildings,
    "floorplans.json": Floorplans,
    "placements.json": Placements,
    "all-graph.json": Graph,
}


@lru_cache(maxsize=1)
def get_s3_client_singleton() -> S3Client:
    return S3Client()


class S3Client:
    BUCKET_NAME = "cmumaps"

    def __init__(self) -> None:
        """
        Initialize the S3 client and related configuration for interacting with the configured bucket.
        
        Reads S3 credentials and endpoint from environment variables S3_ACCESS_KEY, S3_SECRET_KEY, and S3_ENDPOINT, initializes the application logger, and constructs a Minio client assigned to self._client. If S3_ENDPOINT is not set, logs a critical error and raises ValueError("S3_ENDPOINT must be set").
        """
        self.logger = get_app_logger()

        self.access_key = os.getenv("S3_ACCESS_KEY")
        self.secret_key = os.getenv("S3_SECRET_KEY")
        self.s3_endpoint = os.getenv("S3_ENDPOINT")

        if not self.s3_endpoint:
            msg = "S3_ENDPOINT must be set"
            self.logger.critical(msg)
            raise ValueError(msg)

        self._client = Minio(
            self.s3_endpoint,
            access_key=self.access_key,
            secret_key=self.secret_key,
        )

        self.logger = get_app_logger()

    def _get_validator(self, s3_object_name: str) -> type[BaseModel] | None:
        """
        Return the Pydantic model that validates JSON for the given S3 object name by matching known filename suffixes.
        
        Parameters:
            s3_object_name (str): S3 object key or path to match against registered validator filename patterns.
        
        Returns:
            type[BaseModel] | None: The Pydantic model class to use for validation if a matching suffix is found, otherwise `None`.
        """
        for pattern, validator in SCHEMA_VALIDATORS.items():
            if s3_object_name.endswith(pattern):
                return validator
        return None

    def _validate_json_data(
        self, json_data: dict[str, Any], validator: type[BaseModel],
    ) -> bool:
        """
        Validate JSON-decoded data against a Pydantic model.
        
        Parameters:
            json_data (dict[str, Any]): The JSON-decoded data to validate.
            validator (type[BaseModel]): The Pydantic model class to validate the data against.
        
        Returns:
            bool: `True` if the data conforms to the model, `False` otherwise.
        """
        try:
            validator.model_validate(json_data)
        except ValidationError:
            self.logger.exception("Validation failed")
            return False
        else:
            return True

    def upload_json_file(self, local_file_path: str, s3_object_name: str) -> bool:
        """
        Upload a local JSON file to the S3 bucket, validating it against a registered Pydantic schema when applicable.
        
        If a validator is registered for the given s3_object_name, the file is parsed and validated before upload; the upload is aborted on parse or validation failure. On success, the file is uploaded with content type "application/json".
        
        Returns:
            True if the file was uploaded successfully, False otherwise.
        """
        validator = self._get_validator(s3_object_name)

        if validator:
            try:
                with Path(local_file_path).open(encoding="utf-8") as f:
                    json_data = json.load(f)
            except Exception:
                self.logger.exception(
                    "Error loading JSON file %s",
                    local_file_path,
                )
                return False

            if not self._validate_json_data(json_data, validator):
                self.logger.error(
                    "Validation failed for %s, not uploading", local_file_path,
                )
                return False

        try:
            self._client.fput_object(
                self.BUCKET_NAME,
                s3_object_name,
                local_file_path,
                content_type="application/json",
            )
        except Exception:
            self.logger.exception(
                "Error uploading %s to %s",
                local_file_path,
                s3_object_name,
            )
            return False

        return True

    def get_json_file(self, s3_object_name: str) -> dict[str, Any] | None:
        """Get JSON data from S3 bucket."""
        try:
            # Get the object
            response = self._client.get_object(self.BUCKET_NAME, s3_object_name)

            # Read and parse JSON data
            json_data = json.loads(response.read().decode("utf-8"))

        except Exception:
            self.logger.exception(
                "Error getting %s from %s",
                s3_object_name,
                self.BUCKET_NAME,
            )
            return None

        return cast("dict[str, Any]", json_data)


if __name__ == "__main__":
    s3_client = S3Client()
    json_data = s3_client.get_json_file("floorplans/buildings.json")