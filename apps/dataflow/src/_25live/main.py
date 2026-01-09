from logger.app_logger import get_app_logger


def main() -> None:
    app_logger = get_app_logger()
    app_logger.print("Print message")
    app_logger.success("Success message")
    app_logger.debug("Debug message")
    app_logger.info("Info message")
    app_logger.warning("Warning message")
    app_logger.error("Error message")
    app_logger.critical("Critical message")
