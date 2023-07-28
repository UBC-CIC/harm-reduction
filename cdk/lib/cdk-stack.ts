import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_cognito as cognito } from 'aws-cdk-lib';
import { CfnWebACL, CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';
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
      tableName: 'harm_reduction_otps',
      timeToLiveAttribute: 'expiry'
    });

    const SampleTable = new dynamodb.Table(this, 'SampleTable', {
      partitionKey: {name: 'sample-id', type: dynamodb.AttributeType.STRING},
      tableName: 'harm_reduction_samples'
    });

    const UserTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: {name: 'sample-id', type: dynamodb.AttributeType.STRING},
      tableName: 'harm_reduction_users',
      timeToLiveAttribute: 'purge'
    });

    // Lambdas
    const OTPApiHandler = new lambda.Function(this, 'OTPApiHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'otpapihandler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/otpapihandler')),
      functionName: 'OTP_api_handler',
      environment: {'EMAIL_ADDRESS': ''}
    });

    const DBApiHandler = new lambda.Function(this, 'DBApiHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'dbapihandler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/dbapihandler')),
      functionName: 'DB_api_handler',
    });

    const SendNotification = new lambda.Function(this, 'SendNotification', { //TODO Set env variables for api, region, cogclient
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'sendnotif.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/sendnotif')),
      functionName: 'SendNotification',
      environment: {'EMAIL_ADDRESS': ''}
    });

    const prdLogGroup = new logs.LogGroup(this, "PrdLogs");

    const OTPapi = new apigateway.RestApi(this, 'OTPapi', {
      deployOptions: {
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        accessLogDestination: new apigateway.LogGroupLogDestination(prdLogGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
      },
      cloudWatchRole: true,
      endpointConfiguration: {
        types: [ apigateway.EndpointType.REGIONAL ]
      }
    });

    OTPapi.root.addMethod('POST', new apigateway.LambdaIntegration(OTPApiHandler, {proxy: true}));
    OTPapi.root.addMethod('OPTIONS', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    // OTPapi.root.addMethod('OPTIONS', new apigateway.MockIntegration(integrationOptions), methodOptions);

    const DBapi = new apigateway.RestApi(this, 'DBapi', {
      deployOptions: {
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        accessLogDestination: new apigateway.LogGroupLogDestination(prdLogGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
      },
      cloudWatchRole: true,
      endpointConfiguration: {
        types: [ apigateway.EndpointType.REGIONAL ]
      },
    });

    const DBSample = DBapi.root.addResource('samples');
    const DBUser = DBapi.root.addResource('users');

    DBSample.addMethod('POST', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    DBSample.addMethod('GET', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    DBSample.addMethod('PUT', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    DBSample.addMethod('DELETE', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    DBSample.addMethod('OPTIONS', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    DBUser.addMethod('POST', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    DBUser.addMethod('GET', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}), {
      authorizationType: apigateway.AuthorizationType.IAM,
    });
    DBUser.addMethod('PUT', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    DBUser.addMethod('DELETE', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));
    DBUser.addMethod('OPTIONS', new apigateway.LambdaIntegration(DBApiHandler, {proxy: true}));


    const methodSettingProperty: apigateway.CfnDeployment.MethodSettingProperty = {
      cacheDataEncrypted: false,
      cacheTtlInSeconds: 123,
      cachingEnabled: false,
      dataTraceEnabled: false,
      httpMethod: '*',
      loggingLevel: 'INFO',
      metricsEnabled: false,
      resourcePath: '/*',
      throttlingBurstLimit: 123,
      throttlingRateLimit: 123,
    };

    // Lambda Permissions
    const invokedbapiStatement = new iam.PolicyStatement();
    invokedbapiStatement.addActions("execute-api:Invoke");
    invokedbapiStatement.addResources(DBapi.arnForExecuteApi());

    const sessnsStatement = new iam.PolicyStatement();
    sessnsStatement.addActions("ses:SendEmail");
    sessnsStatement.addActions("sns:Publish");
    sessnsStatement.addResources("*");
    
    OTPApiHandler.addToRolePolicy(sessnsStatement);
    OTPApiHandler.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
      resources: [OTPTable.tableArn, `${OTPTable.tableArn}/*`]
    }));

    SendNotification.addToRolePolicy(invokedbapiStatement); 
    SendNotification.addToRolePolicy(sessnsStatement);

    DBApiHandler.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Scan", "dynamodb:UpdateItem", "dynamodb:DeleteItem"],
      resources: [SampleTable.tableArn, UserTable.tableArn, `${SampleTable.tableArn}/*`, `${UserTable.tableArn}/*`]
    }))

    // Cognito
    const adminPool = new cognito.UserPool(this, 'adminuserpool', {
      userPoolName: 'harmreduction-adminpool',
      signInCaseSensitive: false,
      selfSignUpEnabled: false,
      mfa: cognito.Mfa.OFF,
      passwordPolicy: {
        minLength: 8,
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

    new cdk.CfnOutput(this, 'CognitoClientID', {
      value: adminPoolClient.userPoolClientId,
      description: 'Cognito user pool Client ID'
    });

    // Store the gateway ARN for use with our WAF stack 
    const apiGatewayARN = `arn:aws:apigateway:${Stack.of(this).region}::/restapis/${DBapi.restApiId}/stages/${DBapi.deploymentStage.stageName}`

    // Waf Firewall
    const webAcl = new CfnWebACL(this, 'waf', {
      description: 'waf for Harm Reduction API Gateway',
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      visibilityConfig: { 
        sampledRequestsEnabled: true, 
        cloudWatchMetricsEnabled: true,
        metricName: 'parkinsons-survey-firewall'
      },
      rules: [
        {
          name: 'AWS-AWSManagedRulesCommonRuleSet',
          priority: 1,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
            }
          },
          overrideAction: { none: {}},
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'AWS-AWSManagedRulesCommonRuleSet'
          }
        },
        {
          name: 'LimitRequests1000',
          priority: 2,
          action: {
            block: {}
          },
          statement: {
            rateBasedStatement: {
              limit: 1000,
              aggregateKeyType: "IP"
            }
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'LimitRequests1000'
          }
        },
    ]
    })

    // Associate the WAF with the API endpoint
    new CfnWebACLAssociation(this, `WebAclAssociation`, {
      resourceArn: apiGatewayARN,
      webAclArn: webAcl.attrArn
    });
  }
}
