import tomllib

from scripts.sync_github import GithubManager


class SyncManager:
    def __init__(self):
        with open("cmumaps.toml", "r") as f:
            self.team = tomllib.loads(f.read())

    def sync(self):
        GithubManager(self.team).sync()


if __name__ == "__main__":
    SyncManager().sync()
