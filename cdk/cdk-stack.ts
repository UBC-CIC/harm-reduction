import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway } from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });


    // DynamoDB
    const OTPTable = new dynamodb.Table(this, 'OTPTable', {
      partitionKey: { name: 'recipient', type: dynamodb.AttributeType.STRING },
      // timeToLiveAttribute: "TTL"
    });

    const SampleTable = new dynamodb.Table(this, 'SampleTable', {
      partitionKey: {name: 'sample-id', type: dynamodb.AttributeType.STRING},
    });

    const UserTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: {name: 'sample-id', type: dynamodb.AttributeType.STRING},
    });

    // Lambdas
    const OTPApiHandler = new lambda.Function(this, 'OTPApiHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'otpapihandler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'otpapihandler')),
    });

    const DBApiHandler = new lambda.Function(this, 'DBApiHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dbapihandler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'dbapihandler')),
    });

    const SendNotification = new lambda.Function(this, 'SendNotification', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'sendnotif.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'sendnotif')),
    });

    // API Gateways
    const OTPapi = new aws_apigateway.RestApi(this, 'OTPapi');

    const DBApiMethods = ['POST', 'GET', 'PUT', 'DELETE']
    const DBapi = new aws_apigateway.RestApi(this, 'DBapi');
    const DBSample = DBapi.root.addResource('samples');
    const DBUser = DBapi.root.addResource('users');
    for(const method in DBApiMethods){ 
      DBSample.addMethod(method);
      DBUser.addMethod(method);
    }

    // Cognito

    // 
    
  }
}
