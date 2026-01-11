"""Scraper for the FMS svg floorplans."""

from logger import get_app_logger

logger = get_app_logger()


def main() -> None:
    """Entry point to scrape the FMS."""
    logger.info("Scraping FMS")
