import subprocess


def main() -> None:
    subprocess.run(["ruff", "check"], check=False)  # noqa: S607
    subprocess.run(["mypy", "."], check=False)  # noqa: S607
    subprocess.run(["ty", "check"], check=False)  # noqa: S607
