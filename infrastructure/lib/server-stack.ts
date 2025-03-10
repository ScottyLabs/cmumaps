import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import * as ecr from "aws-cdk-lib/aws-ecr";

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
    const cluster = new ecs.Cluster(this, "ServerCluster", {
      vpc: props.vpc,
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
      "cmumaps-data-visualization-backend",
    );

    const secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "ServerSecret",
      "cmumaps-data-visualization/prod/.env",
    );

    // Create Fargate service
    const fargateService =
      new ecsPatterns.ApplicationLoadBalancedFargateService(
        this,
        "ServerService",
        {
          cluster,
          memoryLimitMiB: 1024,
          cpu: 512,
          desiredCount: 1,
          taskImageOptions: {
            image: ecs.ContainerImage.fromEcrRepository(repository),
            environment: {
              DATABASE_HOST: props.database.instanceEndpoint.hostname,
              DATABASE_PORT: "5432",
              DATABASE_NAME: "postgres",
              ALLOWED_ORIGINS: "https://floorsplans.scottylabs.org",
              PORT: "80",
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
            containerPort: 80, // Adjust to match your server's port
          },
          securityGroups: [serviceSecurityGroup],
        },
      );

    // Output the service URL
    new cdk.CfnOutput(this, "ServiceURL", {
      value: fargateService.loadBalancer.loadBalancerDnsName,
      description: "URL of the load balancer",
    });
  }
}
