import json
from shapely import simplify, to_geojson  # type: ignore
from shapely.geometry import shape  # type: ignore


def lambda_handler(event, context):
    if "body" not in event:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "No body provided in the request"}),
        }

    try:
        body = json.loads(event["body"])
    except json.JSONDecodeError:
        return {"statusCode": 400, "body": json.dumps({"error": "Invalid JSON format"})}

    if "polygon" not in body:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "No polygon provided in the body"}),
        }

    try:
        polygon = body["polygon"]
        return {
            "statusCode": 200,
            "body": json.dumps(to_geojson(simplify(shape(polygon), tolerance=5))),
        }
    except Exception as e:
        return {"statusCode": 400, "body": json.dumps({"error": str(e)})}
