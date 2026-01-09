from typing import Any

from .constants import LOGGER_NAME, PRINT_LEVEL


def get_logger_config() -> dict[str, Any]:
    """Get the logger configuration with handler, formatter and filter."""
    handler_name = "console"
    formatter_name = "color"
    filter_name = "status_filter"

    return {
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
                "formatter": formatter_name,
            }
        },
        "formatters": {
            formatter_name: {
                "()": "logger.components.RailwayLogFormatter",
            }
        },
        "filters": {filter_name: {"()": "logger.components.LogStatusFilter"}},
    }
