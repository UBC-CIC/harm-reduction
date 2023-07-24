import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_cognito as cognito } from 'aws-cdk-lib';
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
    });

    const SampleTable = new dynamodb.Table(this, 'SampleTable', {
      partitionKey: {name: 'sample-id', type: dynamodb.AttributeType.STRING},
    });

    const UserTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: {name: 'sample-id', type: dynamodb.AttributeType.STRING},
    });

    // Lmabda - Axios Layer
    const axiosLayer = new lambda.LayerVersion(this, 'axiosLayer', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      code: lambda.Code.fromAsset(path.join(__dirname, './lambdas/axioslayer')),
      compatibleArchitectures: [lambda.Architecture.X86_64],
    });

    // Lambdas
    const OTPApiHandler = new lambda.Function(this, 'OTPApiHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'otpapihandler.handler',
      layers: [axiosLayer],
      code: lambda.Code.fromAsset(path.join(__dirname, './lambdas/otpapihandler')),
    });

    const DBApiHandler = new lambda.Function(this, 'DBApiHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dbapihandler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './lambdas/dbapihandler')),
    });

    const SendNotification = new lambda.Function(this, 'SendNotification', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'sendnotif.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './lambdas/sendnotif')),
    });

    // API Gateways
    const integrationOptions = {
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Origin': '*',
        },
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
    };
    const methodOptions = {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'Access-Control-Allow-Headers': true,
          'Access-Control-Allow-Methods': true,
          'Access-Control-Allow-Origin': true,
        },
      }],
    };

    const OTPapi = new apigateway.RestApi(this, 'OTPapi');
    OTPapi.root.addMethod('POST', new apigateway.LambdaIntegration(OTPApiHandler, {proxy: true}));
    OTPapi.root.addMethod('OPTIONS', new apigateway.MockIntegration(integrationOptions), methodOptions);

    const DBApiMethods = ['POST', 'GET', 'PUT', 'DELETE']
    const DBapi = new apigateway.RestApi(this, 'DBapi');
    const DBSample = DBapi.root.addResource('samples');
    const DBUser = DBapi.root.addResource('users');
    DBSample.addMethod('OPTIONS', new apigateway.MockIntegration(integrationOptions), methodOptions);
    DBUser.addMethod('OPTIONS', new apigateway.MockIntegration(integrationOptions), methodOptions);
    for(const method in DBApiMethods){ 
      DBSample.addMethod(method, new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
      DBUser.addMethod(method, new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    }

    // Cognito
    const adminPool = new cognito.UserPool(this, 'adminuserpool', {
      userPoolName: 'harmreduction-adminpool',
      signInCaseSensitive: false,
      selfSignUpEnabled: false,
      mfa: cognito.Mfa.OFF,
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: cdk.Duration.days(3),
      },
      accountRecovery: cognito.AccountRecovery.NONE,
      deviceTracking: {
        challengeRequiredOnNewDevice: false,
        deviceOnlyRememberedOnUserPrompt: false
      },
    });

    const adminPoolClient = adminPool.addClient('adminpoolclient', {
      authFlows: {
        userPassword: true
      }
    });

    // 
    
  }
}
