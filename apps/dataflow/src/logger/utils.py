from contextlib import contextmanager
from typing import TYPE_CHECKING

from .app_logger import get_app_logger

if TYPE_CHECKING:
    from collections.abc import Generator


def print_section(section: str) -> None:
    logger = get_app_logger()
    logger.print_bold("=" * 50)
    logger.print_bold("%s...", section)
    logger.print_bold("=" * 50 + "\n")


@contextmanager
def log_operation(operation_name: str) -> Generator[None]:
    """
    Context manager to log when an operation starts, finishes, or fails.

    When an exception occurs, it is logged and the traceback is printed,
    and the exception is re-raised.
    """
    logger = get_app_logger()
    logger.info("Starting to %s...", operation_name)
    try:
        yield
        logger.success("Successfully %s.\n", operation_name)
    except Exception:
        logger.exception("Failed to %s", operation_name)
        raise
