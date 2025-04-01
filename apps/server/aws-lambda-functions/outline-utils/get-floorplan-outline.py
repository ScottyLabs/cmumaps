import json
import boto3  # type: ignore

s3_client = boto3.client("s3")

bucket_name = "cmu-floorplans"


def lambda_handler(event, context):
    try:
        file_path = event["queryStringParameters"]["filePath"]
        s3_response = s3_client.get_object(
            Bucket=bucket_name, Key=f"outlines/{file_path}"
        )
        file_data = s3_response["Body"].read().decode("utf-8")
        json_data = json.loads(file_data)
        return {"statusCode": 200, "body": json.dumps({"data": json_data})}
    except Exception as e:
        return {"statusCode": 400, "body": json.dumps({"error": str(e)})}
