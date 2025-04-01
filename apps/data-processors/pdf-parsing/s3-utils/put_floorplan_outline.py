import os
from dotenv import load_dotenv
import requests  # type: ignore

from get_clerk_jwt import get_clerk_jwt

load_dotenv()
AWS_API_INVOKE_URL = os.getenv("NEXT_PUBLIC_AWS_API_INVOKE_URL")
headers = {
    "Authorization": f"Bearer {get_clerk_jwt()}",
    "Content-Type": "application/json",
}

def put_outline_json(data):
    """
    Uploads JSON data to specified file path in AWS S3
    (default to "cmu-floorplans/outlines")

    Args:
        filePath (str): Path where the JSON file will be stored
        data (dict, optional): JSON data to be uploaded. Defaults to None.

    Returns:
        int: HTTP status code from the API response
    """
    headers = {
        "Authorization": f"Bearer {get_clerk_jwt()}",
        "Content-Type": "application/json",
    }

    response = requests.put(
        f"{AWS_API_INVOKE_URL}/development/put-floorplan-outline",
        headers=headers,
        json=data,
    )

    return response


if __name__ == "__main__":
    data = {"key": "many values"}
    response = put_outline_json({"filePath": "test_1.json", "data": data})
    print(response.status_code)
    if not response.ok:
        print(response.json())
