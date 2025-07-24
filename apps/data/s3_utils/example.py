from minio import Minio
import subprocess
import json

res = subprocess.run(
    "VAULT_ADDR=https://secrets.scottylabs.org vault kv get -format=json ScottyLabs/minio/cmumaps",
    shell=True,
    capture_output=True,
)
res = json.loads(res.stdout)
access_key = res["data"]["data"]["access_key"]
secret_key = res["data"]["data"]["secret_key"]

res = subprocess.run(
    "VAULT_ADDR=https://secrets.scottylabs.org vault kv get -format=json ScottyLabs/minio/shared",
    shell=True,
    capture_output=True,
)
res = json.loads(res.stdout)
s3_endpoint = res["data"]["data"]["S3_ENDPOINT"]

# Create client with access and secret key.
client = Minio(
    s3_endpoint,
    access_key=access_key,
    secret_key=secret_key,
)

print(client.bucket_exists("cmumaps"))
