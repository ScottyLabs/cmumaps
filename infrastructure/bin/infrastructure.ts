#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/infrastructure-stack";
import { ServerStack } from "../lib/server-stack";

const app = new cdk.App();

// Create the infrastructure stack first
const infraStack = new InfrastructureStack(app, "InfrastructureStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

// Create the server stack with references to VPC and RDS
new ServerStack(app, "ServerStack", {
  vpc: infraStack.vpc,
  database: infraStack.database,
  dbCredentials: infraStack.dbCredentials,
  dbSecurityGroup: infraStack.dbSecurityGroup,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
