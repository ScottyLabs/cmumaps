import os
from dotenv import load_dotenv
import requests  # type: ignore

from auth_utils.get_clerk_jwt import get_clerk_jwt

load_dotenv()
AWS_API_INVOKE_URL = os.getenv("NEXT_PUBLIC_AWS_API_INVOKE_URL")

headers = {
    "Authorization": f"Bearer {get_clerk_jwt()}",
    "Content-Type": "application/json",
}


def delete_outline_json(file_path):
    """
    Deletes JSON data from specified file path in AWS S3
    (default to "cmu-floorplans/outlines")

    Args:
        filePath (str): Path where the JSON file is stored

    Returns:
        dict: JSON data from the API response
    """

    response = requests.delete(
        f"{AWS_API_INVOKE_URL}/development/delete-floorplan-outline?filePath={file_path}",
        headers=headers,
    )

    return response


if __name__ == "__main__":
    response = delete_outline_json("test_1.json")
    print(response.status_code)
    if not response.ok:
        print(response.json())
