import os
import requests
from dotenv import load_dotenv

load_dotenv()

SERVER_URL = os.getenv("SERVER_URL")
SESSION = os.getenv("SESSION")


def get_api_client(path: str):
    response = requests.get(
        f"{SERVER_URL}/{path}",
        headers={"Cookie": f"SESSION={SESSION}"},
    )
    return response.json()
