import os
import time
import requests  # type: ignore
import jwt  # You may need to install this package with `pip3 install pyjwt`
from dotenv import load_dotenv

load_dotenv()
USER_ID = os.getenv("CLERK_USER_ID")
CLERK_API_KEY = os.getenv("CLERK_SECRET_KEY")


class ClerkJWT:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {CLERK_API_KEY}",
            "Content-Type": "application/json",
        }

    def get_clerk_jwt(self):
        # Check if the JWT is already stored and valid
        jwt_token = os.getenv("CLERK_JWT")
        if jwt_token:
            try:
                # Decode the JWT to check its expiration
                decoded_token = jwt.decode(
                    jwt_token, options={"verify_signature": False}
                )
                if decoded_token["exp"] > time.time():
                    return jwt_token
            except jwt.ExpiredSignatureError:
                pass  # Token is expired, proceed to generate a new one
            except jwt.DecodeError:
                pass  # Token is invalid, proceed to generate a new one

        # Generate a new JWT
        response = requests.post(
            "https://api.clerk.com/v1/sessions",
            headers=self.headers,
            json={"user_id": USER_ID},
        )

        if response.status_code != 200:
            raise Exception(f"Failed to create session: {response.json()}")

        session_id = response.json()["id"]
        response = requests.post(
            f"https://api.clerk.com/v1/sessions/{session_id}/tokens",
            headers=self.headers,
        )

        if response.status_code != 200:
            raise Exception(f"Failed to create token: {response.json()}")

        new_jwt = response.json()["jwt"]

        # Optionally, store the new JWT in an environment variable or a file
        os.environ["CLERK_JWT"] = new_jwt

        return new_jwt


if __name__ == "__main__":
    clerk_jwt = ClerkJWT()
    print(clerk_jwt.get_clerk_jwt())
