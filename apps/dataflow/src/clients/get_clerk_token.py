import os

from clerk_backend_api import Clerk

# Environment variable name for the Clerk token
TOKEN_ENV_KEY = "CLERK_TOKEN"  # noqa: S105

# Load environment variables from .env file
MACHINE_SECRET = os.getenv("CLERK_MACHINE_SECRET")


def get_token() -> str:
    # use cached token if it exists
    if TOKEN_ENV_KEY in os.environ:
        return os.environ[TOKEN_ENV_KEY]

    # create new token if it doesn't exist and cache it
    with Clerk(
        bearer_auth=MACHINE_SECRET,
    ) as clerk:
        res = clerk.m2m.create_token()
        os.environ[TOKEN_ENV_KEY] = res.token
        return res.token


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    print(get_token())  # noqa: T201
