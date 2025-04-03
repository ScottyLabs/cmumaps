deployment steps (RUN FROM REPO ROOT):

1.

```
aws ecr --profile <aws-profile> get-login-password --region us-east-2 | docker login --username AWS --password-stdin 340752840444.dkr.ecr.us-east-2.amazonaws.com
```

2.

```
docker build --platform linux/amd64 -t cmumaps-server -f ./apps/server/Dockerfile .
```

3.

```
docker tag cmumaps-server:latest 340752840444.dkr.ecr.us-east-2.amazonaws.com/cmumaps-server:latest
```

4.

```
docker push 340752840444.dkr.ecr.us-east-2.amazonaws.com/cmumaps-server:latest
```
