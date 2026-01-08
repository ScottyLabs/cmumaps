import subprocess


def main() -> None:
    subprocess.run(["mypy", "check", "."], check=True)  # noqa: S607
    subprocess.run(["mypy", "."], check=True)  # noqa: S607
    subprocess.run(["ty", "check"], check=True)  # noqa: S607
