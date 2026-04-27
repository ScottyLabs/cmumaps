"""OSM data pipeline for CMU Maps."""

from scraper.osm.osm_to_pois_json import main as scrape_pois

__all__ = ["scrape_pois"]
