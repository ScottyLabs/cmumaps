import logging
from functools import lru_cache
from logging.config import dictConfig
from typing import cast

from colorama import init

from ._components import AppLogger
from ._config import get_logger_config
from ._constants import LOGGER_NAME, PRINT_LEVEL, RUNNING_ON_RAILWAY, SUCCESS_LEVEL


@lru_cache(maxsize=1)
def get_app_logger() -> AppLogger:
    """Get the app logger. Cache the result for reuse across the app."""
    # Colorama: ensures reset after each print if not on Railway
    init(autoreset=not RUNNING_ON_RAILWAY)

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
