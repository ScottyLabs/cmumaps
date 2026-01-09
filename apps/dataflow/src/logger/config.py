import os
from typing import Any

from .constants import LOGGER_NAME, PRINT_LEVEL


def get_logger_config() -> dict[str, Any]:
    """Get the logger configuration with handler, formatter and filter."""
    handler_name = "console"
    color_formatter_name = "color"
    railway_formatter_name = "railway"
    filter_name = "status_filter"

    config = {
        "version": 1,
        "loggers": {
            LOGGER_NAME: {
                "handlers": [handler_name],
                "level": PRINT_LEVEL,
                "filters": [filter_name],
            }
        },
        "handlers": {
            handler_name: {
                "class": "logging.StreamHandler",
                "formatter": color_formatter_name,
                "stream": "ext://sys.stdout",
            }
        },
        "formatters": {
            color_formatter_name: {
                "()": "logger.components.ColorFormatter",
            },
            railway_formatter_name: {
                "()": "logger.components.RailwayLogFormatter",
            },
        },
        "filters": {filter_name: {"()": "logger.components.LogStatusFilter"}},
    }

    # If the project is running on Railway, use the Railway log formatter instead of
    # the color formatter
    if os.getenv("RAILWAY_PROJECT_NAME"):
        config["handlers"][handler_name]["formatter"] = railway_formatter_name

    return config
