from clerk_backend_api import Clerk
import os
from dotenv import load_dotenv

# Environment variable name for the Clerk token
CLERK_TOKEN = "CLERK_TOKEN"

# Load environment variables from .env file
load_dotenv()
MACHINE_SECRET = os.getenv("CLERK_MACHINE_SECRET")


def get_clerk_token():
    # use cached token if it exists
    if CLERK_TOKEN in os.environ:
        return os.environ[CLERK_TOKEN]

    # create new token if it doesn't exist and cache it
    with Clerk(
        bearer_auth=MACHINE_SECRET,
    ) as clerk:
        res = clerk.m2m.create_token()
        os.environ[CLERK_TOKEN] = res.token
        return res.token


if __name__ == "__main__":
    print(get_clerk_token())
