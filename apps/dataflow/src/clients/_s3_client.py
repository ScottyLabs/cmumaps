import json
import os
from functools import lru_cache
from typing import Any, cast

from minio import Minio

from logger import get_app_logger


@lru_cache(maxsize=1)
def get_s3_client_singleton() -> S3Client:
    return S3Client()


class S3Client:
    BUCKET_NAME = "cmumaps"

    def __init__(self) -> None:
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

    def upload_json_file(self, local_file_path: str, s3_object_name: str) -> bool:
        """Upload a JSON file to S3 bucket. Return if the upload was successful."""
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
