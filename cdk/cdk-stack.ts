import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_pinpoint as pinpoint } from 'aws-cdk-lib';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const pinpointApp = new pinpoint.CfnApp(this, 'HarmReduction', {
      name: 'HarmReduction'
    })

    // OTP functionality
    const OTPTable = new dynamodb.Table(this, 'OTPTable', {
      partitionKey: { name: 'recipient', type: dynamodb.AttributeType.STRING },
      // timeToLiveAttribute: "TTL"
    });

    const sendOTPFunction = new lambda.Function(this, 'sendOTP', {
      timeout: cdk.Duration.seconds(600),
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'sendotp.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './lambdas/sendotp')),
    });

    const verifyOTPFunction = new lambda.Function(this, 'verifyOTP', {
      timeout: cdk.Duration.seconds(600),
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'verify.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './lambdas/verifyotp')),
    });
    
  }
}
