from clerk_backend_api import Clerk
import os
from dotenv import load_dotenv
from pathlib import Path


class ClerkTokenManager:
    def __init__(self, environment: str | None):
        """
        environment: 'dev', 'staging', 'prod', or None for local.
        """
        root = Path(__file__).resolve().parents[1]

        self.environment_name = environment

        if environment is None:
            env_file = root / ".env"
        else:
            env_file = root / f".env.{environment}"

        load_dotenv(env_file, override=True)

        # Load required environment-specific variables
        self.server_url = os.getenv("SERVER_URL")
        self.machine_secret = os.getenv("CLERK_MACHINE_SECRET")
        self.token_env_key = "CLERK_TOKEN"

        if not self.machine_secret:
            raise ValueError(
                "CLERK_MACHINE_SECRET is missing in the environment variables."
            )
        if not self.server_url:
            raise ValueError("SERVER_URL is missing in the environment variables.")

        # In-memory cached token
        self._cached_token = None

    def get_clerk_token(self):
        if self._cached_token:
            return self._cached_token
        if self.token_env_key in os.environ:
            self._cached_token = os.environ[self.token_env_key]
            return self._cached_token
        with Clerk(bearer_auth=self.machine_secret) as clerk:
            res = clerk.m2m.create_token()
            token = res.token

            # Cache in memory
            self._cached_token = token
            # Optionally cache in environment (process-level only)
            os.environ[self.token_env_key] = token

            return token
