import json
import boto3  # type: ignore
import base64

s3_client = boto3.client("s3")

bucket_name = "cmu-floorplans"


def lambda_handler(event, context):
    try:
        file_path = event["queryStringParameters"]["filePath"]
        s3_response = s3_client.get_object(Bucket=bucket_name, Key=f"pdf/{file_path}")
        file_data = s3_response["Body"].read()
        pdf_base64 = base64.b64encode(file_data).decode("utf-8")
        return {"statusCode": 200, "body": json.dumps({"data": pdf_base64})}
    except Exception as e:
        return {"statusCode": 400, "body": json.dumps({"error": str(e)})}
