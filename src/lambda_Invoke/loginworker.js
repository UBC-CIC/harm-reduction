import { LambdaClient, InvokeCommand, Lambda } from "@aws-sdk/client-lambda";
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { toUtf8 } from "@aws-sdk/util-utf8";

// import config from '../config.json';

export const authUser = async (username, password) => {
    const CLIENTID = process.env.REACT_APP_COGCLIENT;

    const cognitoIdpClient = new CognitoIdentityProviderClient({region: 'us-west-2'});
    const initAuthCMD = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH", //"USER_SRP_AUTH" || "REFRESH_TOKEN_AUTH" || "REFRESH_TOKEN" || "CUSTOM_AUTH" || "ADMIN_NO_SRP_AUTH" || "USER_PASSWORD_AUTH" || "ADMIN_USER_PASSWORD_AUTH", // required
        AuthParameters: { 
            //"<keys>": "STRING_VALUE",
            "USERNAME": username,
            "PASSWORD": password
        },
        ClientId: CLIENTID, // required
    })

    try{
        const initAuthResp = await cognitoIdpClient.send(initAuthCMD);
        console.log(initAuthResp.AuthenticationResult);
        return initAuthResp.AuthenticationResult;
    }catch(err){
        console.log(err);
        return err;
    }
    // const INITAUTHLAMBDA = 'initauth-test';
    // // const COGCLIENTID = '';

    // const credentials = {
    //     accessKeyId: config.ID,
    //     secretAccessKey: config.Key
    // }

    // const lambdaClient = new LambdaClient({
    //     region: 'us-west-2', 
    //     credentials: credentials
    // });

    // const initAuthCMD  = new InvokeCommand({
    //     FunctionName: INITAUTHLAMBDA,
    //     InvocationType: "RequestResponse",
    //     LogType: "Tail",
    //     Payload: JSON.stringify({
    //         username: username,
    //         password: password 
    //     })
    // });

    // try{
    //     const initAuthResp = await lambdaClient.send(initAuthCMD);
    //     let respPayload = JSON.parse(toUtf8(initAuthResp.Payload));
    //     console.log(respPayload);

    //     return respPayload;
    // }catch(err){
    //     console.log(err);
    //     return err;
    // }
}

