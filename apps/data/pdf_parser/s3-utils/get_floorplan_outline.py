import os
from dotenv import load_dotenv
import requests  # type: ignore

from get_clerk_jwt import get_clerk_jwt

load_dotenv()
AWS_API_INVOKE_URL = os.getenv("AWS_API_INVOKE_URL")

headers = {
    "Authorization": f"Bearer {get_clerk_jwt()}",
    "Content-Type": "application/json",
}


def get_outline_json(file_path):
    """
    Get JSON data from specified file path in AWS S3
    (default to "cmu-floorplans/outlines")

    Args:
        filePath (str): Path where the JSON file is stored

    Returns:
        dict: JSON data from the API response
    """

    response = requests.get(
        f"{AWS_API_INVOKE_URL}/development/get-floorplan-outline?filePath={file_path}",
        headers=headers,
    )

    return response


if __name__ == "__main__":
    response = get_outline_json("HL/HL-1.json")
    print(response.status_code)
    if response.ok:
        data = response.json()["data"]
    else:
        print(response.json())
