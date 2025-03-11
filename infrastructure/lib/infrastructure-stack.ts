import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export class InfrastructureStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly database: rds.DatabaseInstance;
  public readonly dbCredentials: secretsmanager.Secret;
  public readonly dbSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    this.vpc = new ec2.Vpc(this, "CmuMapsVpc", {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: "Isolated",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // Create security group for RDS
    this.dbSecurityGroup = new ec2.SecurityGroup(this, "DbSecurityGroup", {
      vpc: this.vpc,
      description: "Security group for RDS instance",
      allowAllOutbound: true,
    });

    // Allow inbound PostgreSQL traffic on port 5432
    this.dbSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
      "Allow PostgreSQL access from within VPC",
    );

    // Create credentials in Secrets Manager
    this.dbCredentials = new secretsmanager.Secret(this, "DbCredentials", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "postgres" }),
        generateStringKey: "password",
        excludePunctuation: true,
      },
    });

    // Create RDS instance
    this.database = new rds.DatabaseInstance(this, "CmuMapsDatabase", {
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      credentials: rds.Credentials.fromSecret(this.dbCredentials),
      multiAz: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(7),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      securityGroups: [this.dbSecurityGroup],
    });

    const ubuntuAmi = new ec2.GenericSSMParameterImage(
      "/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id",
      ec2.OperatingSystemType.LINUX,
    );

    const bastionSG = new ec2.SecurityGroup(this, "BastionSecurityGroup", {
      vpc: this.vpc,
      allowAllOutbound: true,
    });

    bastionSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH access",
    );

    // Bastion host
    const bastionHost = new ec2.Instance(this, "BastionHost", {
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: ubuntuAmi,
      securityGroup: bastionSG,
    });

    this.database.connections.allowFrom(bastionHost, ec2.Port.tcp(5432));
    bastionHost.connections.allowFrom(bastionSG, ec2.Port.tcp(22));

    // Output the bastion host public IP
    new cdk.CfnOutput(this, "BastionHostPublicIp", {
      value: bastionHost.instancePublicIp,
      description: "Bastion host public IP",
    });

    // Output the database endpoint
    new cdk.CfnOutput(this, "DbEndpoint", {
      value: this.database.instanceEndpoint.hostname,
      description: "Database endpoint",
    });

    // Output the secret ARN
    new cdk.CfnOutput(this, "DbCredentialsArn", {
      value: this.dbCredentials.secretArn,
      description: "Database credentials secret ARN",
    });
  }
}
