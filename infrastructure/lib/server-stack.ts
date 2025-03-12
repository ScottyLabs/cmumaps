import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";

interface ServerStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  database: rds.IDatabaseInstance;
  dbCredentials: secretsmanager.ISecret;
  dbSecurityGroup: ec2.ISecurityGroup;
}

export class ServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ServerStackProps) {
    super(scope, id, props);

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, "CmumapsCluster", {
      vpc: props.vpc,
      clusterName: "cmumaps-cluster",
    });

    // Create security group for the Fargate service
    const serviceSecurityGroup = new ec2.SecurityGroup(
      this,
      "ServiceSecurityGroup",
      {
        vpc: props.vpc,
        description: "Security group for Fargate service",
        allowAllOutbound: true,
      },
    );

    // Allow inbound traffic on port 3000 (or whatever port your server uses)
    serviceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3000),
      "Allow inbound HTTP traffic",
    );

    // Allow the service security group to access RDS
    // props.dbSecurityGroup.addIngressRule(
    //   serviceSecurityGroup,
    //   ec2.Port.tcp(5432),
    //   "Allow access from Fargate service",
    // );

    // props.database.connections.allowFrom(serviceSecurityGroup, ec2.Port.tcp(5432));

    const repository = ecr.Repository.fromRepositoryName(
      this,
      "ServerRepository",
      "cmumaps-server",
    );

    const secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "ServerSecret",
      "cmumaps-data-visualization/prod/.env",
    );

    // Get hosted zone from context or use default
    const domainName = "scottylabsapis.com";

    // Look up the hosted zone
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName,
    });

    // Create a certificate for the domain
    const certificate = new acm.Certificate(this, "Certificate", {
      domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Create Fargate service with HTTPS
    const fargateService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(
        this,
        "CmumapsServerService",
        {
          cluster,
          memoryLimitMiB: 1024,
          cpu: 512,
          desiredCount: 1,
          serviceName: "cmumaps-server",
          taskImageOptions: {
            image: ecs.ContainerImage.fromEcrRepository(repository),
            containerName: "cmumaps-server",
            environment: {
              DATABASE_HOST: props.database.instanceEndpoint.hostname,
              DATABASE_PORT: "5432",
              DATABASE_NAME: "postgres",
              ALLOWED_ORIGINS: "https://floorplans.scottylabs.org",
              PORT: "3000",
            },
            secrets: {
              DATABASE_USERNAME: ecs.Secret.fromSecretsManager(
                props.dbCredentials,
                "username",
              ),
              DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(
                props.dbCredentials,
                "password",
              ),
              CLERK_SECRET_KEY: ecs.Secret.fromSecretsManager(
                secret,
                "clerk_secret_key",
              ),
              CLERK_PUBLISHABLE_KEY: ecs.Secret.fromSecretsManager(
                secret,
                "clerk_publishable_key",
              ),
            },
            containerPort: 3000, // Adjust to match your server's port
          },
          securityGroups: [serviceSecurityGroup],
          domainName,
          domainZone: hostedZone,
          certificate: certificate,
          redirectHTTP: true,
        },
      );

    // Output the HTTPS URL
    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: `https://${domainName}`,
      description: "HTTPS API endpoint",
    });
  }
}
