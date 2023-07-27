import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_cognito as cognito } from 'aws-cdk-lib';
import { CfnWebACL, CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

const REGION = process.env.REACT_APP_AWS_REGION;
const DB_APIurl = process.env.REACT_APP_DB_API_URL;
const OTP_APIurl = process.env.REACT_APP_OTP_API_URL;
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
      timeToLiveAttribute: 'expiry'
    });

    const SampleTable = new dynamodb.Table(this, 'SampleTable', {
      partitionKey: {name: 'sample-id', type: dynamodb.AttributeType.STRING},
      tableName: 'samples'
    });

    const UserTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: {name: 'sample-id', type: dynamodb.AttributeType.STRING},
      tableName: 'users',
      timeToLiveAttribute: 'ttl'
    });

    // Lambdas
    const OTPApiHandler = new lambda.Function(this, 'OTPApiHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'otpapihandler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/otpapihandler')),
    });

    const DBApiHandler = new lambda.Function(this, 'DBApiHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dbapihandler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/dbapihandler')),
    });

    const SendNotification = new lambda.Function(this, 'SendNotification', { //TODO Set env variables for api, region, cogclient
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'sendnotif.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/sendnotif')),
    });

    const statement = new iam.PolicyStatement();
    statement.addActions("execute-api:Invoke");
    statement.addResources(DB_APIurl + '/*');

    SendNotification.addToRolePolicy(statement); 

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

    const OTPapi = new apigateway.RestApi(this, 'OTPapi', {
      deployOptions: {
        stageName: 'prod',
      }
    });
    OTPapi.root.addMethod('POST', new apigateway.LambdaIntegration(OTPApiHandler, {proxy: true}));
    OTPapi.root.addMethod('OPTIONS', new apigateway.MockIntegration(integrationOptions), methodOptions);

    const DBApiMethods = ['POST', 'GET', 'PUT', 'DELETE']
    const DBapi = new apigateway.RestApi(this, 'DBapi', {
      deployOptions: {
        stageName: 'prod',
      }
    });
    const DBSample = DBapi.root.addResource('samples');
    const DBUser = DBapi.root.addResource('users');
    
    DBSample.addMethod('OPTIONS', new apigateway.MockIntegration(integrationOptions), methodOptions);
    DBUser.addMethod('OPTIONS', new apigateway.MockIntegration(integrationOptions), methodOptions);
    for(let i=0; i<DBApiMethods.length; i++){
      let method = DBApiMethods[i]; 
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

    const adminUser = new cognito.CfnUserPoolUser(this, 'adminuser', {
      userPoolId: adminPool.userPoolId,
      forceAliasCreation: false,
      username: 'admin'
    });

    // 
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
