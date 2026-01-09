import json
import logging
from typing import Any, ClassVar

from colorama import Fore, Style
from colorama.ansi import Back

from .constants import PRINT_LEVEL, SUCCESS_LEVEL


class AppLogger(logging.Logger):
    """Custom logger that adds a .success() method and .print() method."""

    def success(self, msg: str, *args: Any, **kwargs: Any) -> None:  # noqa: ANN401
        if self.isEnabledFor(SUCCESS_LEVEL):
            self._log(SUCCESS_LEVEL, msg, args, **kwargs)

    def print_bold(self, msg: str, *args: Any, **kwargs: Any) -> None:  # noqa: ANN401
        if self.isEnabledFor(PRINT_LEVEL):
            self._log(PRINT_LEVEL, Style.BRIGHT + msg, args, **kwargs)

    def print(self, msg: str, *args: Any, **kwargs: Any) -> None:  # noqa: ANN401
        if self.isEnabledFor(PRINT_LEVEL):
            self._log(PRINT_LEVEL, msg, args, **kwargs)


class LogStatusFilter(logging.Filter):
    """A logger filter to track whether any wanrnings or errors were logged."""

    def __init__(self) -> None:
        super().__init__()
        self.error_logged = 0
        self.warning_logged = 0

    def filter(self, record: logging.LogRecord) -> bool:
        if record.levelno == logging.ERROR:
            self.error_logged += 1

        if record.levelno == logging.WARNING:
            self.warning_logged += 1

        return True


class ColorFormatter(logging.Formatter):
    """Color formatter for the logger."""

    COLOR_MAP: ClassVar = {
        logging.DEBUG: Fore.LIGHTBLACK_EX,
        logging.INFO: Fore.BLUE,
        SUCCESS_LEVEL: Fore.GREEN,
        logging.WARNING: Fore.YELLOW,
        logging.ERROR: Fore.RED,
        logging.CRITICAL: Back.RED + Fore.WHITE,
    }

    def format(self, record: logging.LogRecord) -> str:
        color = self.COLOR_MAP.get(record.levelno, "")
        base = super().format(record)

        # Strip the [PRINT] prefix for PRINT level
        if record.levelno == PRINT_LEVEL:
            return f"{color}{record.getMessage()}{Style.RESET_ALL}"

        return f"{color}{base}{Style.RESET_ALL}"


class RailwayLogFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_record = {
            "time": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
        }
        return json.dumps(log_record)
