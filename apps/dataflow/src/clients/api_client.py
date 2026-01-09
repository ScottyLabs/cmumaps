import os

from clerk_backend_api import Clerk


class ApiClient:
    def __init__(self) -> None:
        # Load required environment-specific variables
        self.server_url = os.getenv("SERVER_URL")
        self.machine_secret = os.getenv("CLERK_MACHINE_SECRET")

        # In-memory cached token
        self._cached_token = None

    def get_token(self) -> str:
        if self._cached_token:
            return self._cached_token

        with Clerk(bearer_auth=self.machine_secret) as clerk:
            res = clerk.m2m.create_token()
            token = res.token

            # Cache in memory
            self._cached_token = token
            return token
