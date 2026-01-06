from minio import Minio
from dotenv import load_dotenv
import os
import json


class S3Client:
    BUCKET_NAME = "cmumaps"

    def __init__(self, environment: str):
        if environment not in ["local", "staging", "prod"]:
            raise ValueError("Invalid environment: must be local, staging, or prod")

        env_file = f".env.{environment}"
        load_dotenv(env_file, override=True)

        self.access_key = os.getenv("S3_ACCESS_KEY")
        self.secret_key = os.getenv("S3_SECRET_KEY")
        self.s3_endpoint = os.getenv("S3_ENDPOINT")

        self._client = Minio(
            self.s3_endpoint,
            access_key=self.access_key,
            secret_key=self.secret_key,
        )

    def upload_json_file(self, local_file_path, s3_object_name):
        """Upload a JSON file to S3 bucket"""
        try:
            # Upload the file
            self._client.fput_object(
                self.BUCKET_NAME,
                s3_object_name,
                local_file_path,
                content_type="application/json",
            )
            print(f"Successfully uploaded {local_file_path} as {s3_object_name}")
            return True
        except Exception as e:
            print(f"Error uploading {local_file_path}: {e}")
            return False

    def download_json_file(self, s3_object_name, local_file_path):
        """Download a JSON file from S3 bucket"""
        try:
            # Download the file
            self._client.fget_object(self.BUCKET_NAME, s3_object_name, local_file_path)
            print(f"Successfully downloaded {s3_object_name} to {local_file_path}")
            return True
        except Exception as e:
            print(f"Error downloading {s3_object_name}: {e}")
            return False

    def get_json_file(self, s3_object_name):
        """
        Get JSON data from S3 bucket
        """
        try:
            # Get the object
            response = self._client.get_object(self.BUCKET_NAME, s3_object_name)

            # Read and parse JSON data
            json_data = json.loads(response.read().decode("utf-8"))
            response.close()
            print(f"Successfully retrieved JSON data from {s3_object_name}")
            return json_data

        except Exception as e:
            print(f"Error getting {s3_object_name}: {e}")
            return None

    def list_objects(self):
        """List all objects in the bucket"""
        try:
            objects = self._client.list_objects(self.BUCKET_NAME, recursive=True)
            print(f"\nObjects in bucket '{self.BUCKET_NAME}':")
            for obj in objects:
                print(f"  - {obj.object_name} ({obj.size} bytes)")
        except Exception as e:
            print(f"Error listing objects: {e}")


if __name__ == "__main__":
    s3_utils = S3Client("local")
    s3_utils.list_objects()
