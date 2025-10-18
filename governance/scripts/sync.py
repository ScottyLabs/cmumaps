import tomllib

import os
from dotenv import load_dotenv

from scripts.sync_github import GithubManager
from scripts.sync_clerk import ClerkManager

load_dotenv()


class SyncManager:
    def __init__(self):
        with open("cmumaps.toml", "r") as f:
            self.team = tomllib.loads(f.read())

    def sync(self):
        GithubManager(self.team).sync()

        secret_key = os.getenv("CLERK_DEV_SECRET_KEY")
        org_id = os.getenv("CLERK_DEV_ORG_ID")
        ClerkManager(self.team, secret_key, org_id, "Dev").sync()

        secret_key = os.getenv("CLERK_PROD_SECRET_KEY")
        org_id = os.getenv("CLERK_PROD_ORG_ID")
        ClerkManager(self.team, secret_key, org_id, "Prod").sync()


if __name__ == "__main__":
    SyncManager().sync()
