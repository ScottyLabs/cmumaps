"""Runner script that executes driver.py followed by get_all_svg.py."""

import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


def main() -> None:
    """Run driver.py, then get_all_svg.py."""
    driver_script = SCRIPT_DIR / "driver.py"
    get_svg_script = SCRIPT_DIR / "get_all_svg.py"

    print("=== Running driver.py ===")  # noqa: T201
    result = subprocess.run([sys.executable, str(driver_script)], check=False)  # noqa: S603

    if result.returncode != 0:
        print(f"driver.py exited with code {result.returncode}")  # noqa: T201
        sys.exit(result.returncode)

    print("\n=== driver.py finished, running get_all_svg.py ===")  # noqa: T201
    result = subprocess.run([sys.executable, str(get_svg_script)], check=False)  # noqa: S603

    if result.returncode != 0:
        print(f"get_all_svg.py exited with code {result.returncode}")  # noqa: T201
        sys.exit(result.returncode)

    print("\n=== All scripts completed successfully ===")  # noqa: T201


if __name__ == "__main__":
    main()
