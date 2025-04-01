import json
import boto3  # type: ignore

s3_client = boto3.client("s3")

bucket_name = "cmu-floorplans"


def lambda_handler(event, context):
    try:
        file_path = event["queryStringParameters"]["filePath"]
        s3_client.delete_object(Bucket=bucket_name, Key=f"outlines/{file_path}")
        return {"statusCode": 200}
    except Exception as e:
        return {"statusCode": 400, "body": json.dumps({"error": str(e)})}
