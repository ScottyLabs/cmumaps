import os

from clerk_backend_api import Clerk

from clients.get_clerk_token import TOKEN_ENV_KEY


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
        if TOKEN_ENV_KEY in os.environ:
            self._cached_token = os.environ[TOKEN_ENV_KEY]
            return self._cached_token
        with Clerk(bearer_auth=self.machine_secret) as clerk:
            res = clerk.m2m.create_token()
            token = res.token

            # Cache in memory
            self._cached_token = token
            # Optionally cache in environment (process-level only)
            os.environ[self.token_env_key] = token

            return token
