import os
import time
from dotenv import load_dotenv
import requests  # type: ignore
import jwt  # You may need to install this package

load_dotenv()
USER_ID = os.getenv("CLERK_USER_ID")
CLERK_API_KEY = os.getenv("CLERK_SECRET_KEY")


def get_clerk_jwt():
    headers = {
        "Authorization": f"Bearer {CLERK_API_KEY}",
        "Content-Type": "application/json",
    }

    # Check if the JWT is already stored and valid
    jwt_token = os.getenv("CLERK_JWT")
    if jwt_token:
        try:
            # Decode the JWT to check its expiration
            decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})
            if decoded_token["exp"] > time.time():
                return jwt_token
        except jwt.ExpiredSignatureError:
            pass  # Token is expired, proceed to generate a new one
        except jwt.DecodeError:
            pass  # Token is invalid, proceed to generate a new one

    # Generate a new JWT
    response = requests.post(
        "https://api.clerk.com/v1/sessions", headers=headers, json={"user_id": USER_ID}
    )

    session_id = response.json()["id"]

    response = requests.post(
        f"https://api.clerk.com/v1/sessions/{session_id}/tokens", headers=headers
    )

    new_jwt = response.json()["jwt"]

    # Optionally, store the new JWT in an environment variable or a file
    os.environ["CLERK_JWT"] = new_jwt

    return new_jwt


if __name__ == "__main__":
    print(get_clerk_jwt())
