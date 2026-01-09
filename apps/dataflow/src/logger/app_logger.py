import logging
from functools import lru_cache
from logging.config import dictConfig
from typing import cast

from colorama import init

from .components import AppLogger
from .config import get_logger_config
from .constants import LOGGER_NAME, PRINT_LEVEL, SUCCESS_LEVEL


@lru_cache(maxsize=1)
def get_app_logger() -> AppLogger:
    """Get the app logger. Cache the result for reuse across the app."""
    # Colorama: ensures reset after each print and force keep ANSI for colors
    init(autoreset=True, strip=False)

    # Register the success and print log levels
    logging.addLevelName(SUCCESS_LEVEL, "SUCCESS")
    logging.addLevelName(PRINT_LEVEL, "PRINT")

    # Set the custom logger class
    logging.setLoggerClass(AppLogger)

    # Configure the logger with handler, formatter and filter
    dictConfig(get_logger_config())

    # Create the logger
    app_logger = logging.getLogger(LOGGER_NAME)

    # Return the app logger
    return cast("AppLogger", app_logger)
