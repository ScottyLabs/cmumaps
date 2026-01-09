from logger.app_logger import get_app_logger


def main() -> None:
    app_logger = get_app_logger()
    app_logger.print("Hello, World!")
