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


def get_file(filePath):
    """
    Retrieves JSON data from specified file path in AWS S3

    Args:
        filePath (str): Path where the JSON file is stored

    Returns:
        requests.models.Response: API
    """
    response = requests.get(
        f"{AWS_API_INVOKE_URL}/development/get-floorplan-pdf?filePath={filePath}",
        headers=headers,
    )

    return response


if __name__ == "__main__":
    response = get_file("HL/HL-1.pdf")
    print(response.status_code)
    if response.ok:
        data = response.json()["data"]
        print(data)
    else:
        print(response.json())
