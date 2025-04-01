# This function verifies the jwt token in query string parameter
# using Clerk Development and Produdction public keys.
# Can be used to protect AWS WebSocket onConnect

import logging
import jwt  # type: ignore

logger = logging.getLogger()
logger.setLevel("INFO")

DEV_PUBLIC_KEY = """\
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8N5FAExT3HKQYWevybLq
NALvz/dx3WPlZOm5l5XK+py0siFU4MskxxrGyPR5rnyaJuflqsj7ID6IFRhabYOv
hcAfEKWMEDgPN9JokksStm6A+cUlzkeG8T53tNM8Q391sGtztsksutQWaNFYuHkz
6ZSLBZRvsQ1AmZYJ1+HbqlDfBFrtZPIdS0QD9fGnAuHDnoSlUz5SIncrSfZZJdaF
DemNxTE3Y42hNG2p0DmsPIWJ6J+LsSj0Upk7Pt3P/rotSKZ4urKypzhbGU1joeUv
FeHPhf3qpDdf9qqrrtbEadBnb8vthuexIYPSRNRlZCVmgXlMhFRUuPIZQ7UKCi7+
zwIDAQAB
-----END PUBLIC KEY-----"""

PROD_PUBLIC_KEY = """\
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo9nMbZ4NPluyyBJT4RyD
yiYNzgTo05+9wQLIgo0GNhCu6/1laQsqTeIybMVSYbXDG4jO3b5AHfpLW9ICzhWU
NBYx/PkjF8t9Cz+qOiR8uhfR3n3qUxbuC9Xg5o60PW53so6CnFjIEdanRduy8jUA
UY7iu8yftgXZMCNx+1lFuRu4lqb39unkkEXqgw5y27XREFGVomzslgHNcma0Glss
lQhf23j9zrJG6WigDYKRbFDihfMNy6LAU1+uiFVmAGW1XUb7O1VVLwJKBrA6JI0D
I6WhMgYEawAnVs3VPG1o2Yt4uUG7CwkrIPHQuVVbFJX47NIW9kUQnotYqz+mOQNQ
BQIDAQAB
-----END PUBLIC KEY-----"""

PUBLIC_KEYS = [DEV_PUBLIC_KEY, PROD_PUBLIC_KEY]


def lambda_handler(event, context):
    # Access the query string token
    token = event.get("queryStringParameters", {}).get("token")
    method_arn = event.get("methodArn")
    for public_key in PUBLIC_KEYS:
        try:
            decoded = jwt.decode(
                token,
                public_key,
                algorithms="RS256",
                options={"verify_aud": False, "verify_signature": True},
            )
            # Allow access if the token is valid
            return generate_policy(decoded.get("sub"), "Allow", method_arn)
        except jwt.exceptions.InvalidTokenError:
            pass
        except Exception as e:
            logger.error(e)
            pass

    # Deny access
    raise Exception("Unauthorized")


def generate_policy(principal_id, effect, resource):
    policy_document = {
        "Version": "2012-10-17",
        "Statement": [
            {"Action": "execute-api:Invoke", "Effect": effect, "Resource": resource}
        ],
    }
    return {
        "principalId": principal_id,
        "policyDocument": policy_document,
    }
