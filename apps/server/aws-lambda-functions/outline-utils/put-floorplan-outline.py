import json
import boto3  # type: ignore

s3_client = boto3.client("s3")

bucket_name = "cmu-floorplans"


def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        file_path = body["filePath"]
        data = body["data"]
        s3_client.put_object(
            Bucket=bucket_name,
            Key=f"outlines/{file_path}",
            Body=json.dumps(data),
            ContentType="application/json",
        )
        return {"statusCode": 200}
    except Exception as e:
        return {"statusCode": 400, "body": json.dumps({"error": str(e)})}
