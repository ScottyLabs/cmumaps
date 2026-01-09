from clients import get_api_client_singleton, get_s3_client_singleton
from logger import get_app_logger


def populate_node_table() -> None:
    """
    Populate the Node table using all-graph.json.

    Precondition: Room table must be populated.
    """
    # Get the logger and clients
    logger = get_app_logger()
    api_client = get_api_client_singleton()
    s3_client = get_s3_client_singleton()

    # Get the all-graph data from S3
    data = s3_client.get_json_file("floorplans/all-graph.json")
    if data is None:
        msg = "Failed to get all-graph data from S3"
        logger.critical(msg)
        raise ValueError(msg)

    # Iterate through all nodes and create a list of nodes data
    # in the required format for the populate node table api endpoint
    node_data = []
    for node_id in data:
        node = data[node_id]
        latitude = node["coordinate"]["latitude"]
        longitude = node["coordinate"]["longitude"]
        building_code = node["floor"]["buildingCode"]
        floor_level = node["floor"]["level"]
        room_id = node["roomId"] if building_code != "outside" else ""

        node = {
            "nodeId": node_id,
            "latitude": latitude,
            "longitude": longitude,
            "buildingCode": building_code if building_code != "outside" else None,
            "floorLevel": floor_level if building_code != "outside" else None,
            "roomId": room_id if room_id else None,
        }

        node_data.append(node)

    # Send request to server to populate Node table
    if not api_client.populate_table("Node", node_data):
        msg = "Failed to populate the Node table"
        logger.critical(msg)
        raise RuntimeError(msg)
