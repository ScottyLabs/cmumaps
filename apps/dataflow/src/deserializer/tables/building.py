import json

from clients import get_api_client_singleton, get_s3_client_singleton
from logger import get_app_logger


# Populate Building table
def populate_building_table() -> None:
    """
    Populate the Building table.

    Raises ValueError if the data cannot be retrieved from S3.
    """
    logger = get_app_logger()
    api_client = get_api_client_singleton()
    s3_client = get_s3_client_singleton()

    # Get buildings data from S3
    data = s3_client.get_json_file("floorplans/buildings.json")
    if data is None:
        msg = "Failed to get buildings data from S3"
        logger.critical(msg)
        raise ValueError(msg)

    # Iterate through all buildings and create a list of buildings data
    # in the shape of the Building table
    buildings_data = []
    for building_code in data:
        name = data[building_code]["name"]
        osm_id = data[building_code]["osmId"]
        if "defaultOrdinal" in data[building_code]:
            default_ordinal = data[building_code]["defaultOrdinal"]
        else:
            default_ordinal = None
        label_latitude = data[building_code]["labelPosition"]["latitude"]
        label_longitude = data[building_code]["labelPosition"]["longitude"]
        shape = json.dumps(data[building_code]["shapes"])
        hitbox = json.dumps(data[building_code]["hitbox"])
        # Create building entry
        building = {
            "buildingCode": building_code,
            "name": name,
            "osmId": osm_id,
            "defaultOrdinal": default_ordinal,
            "labelLatitude": label_latitude,
            "labelLongitude": label_longitude,
            "shape": shape,
            "hitbox": hitbox,
        }
        buildings_data.append(building)

    # Populate Building table
    if not api_client.populate_table("Buildings", buildings_data):
        msg = "Failed to populate Building table"
        logger.critical(msg)
        raise RuntimeError(msg)
