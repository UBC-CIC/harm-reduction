import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

// import config from '../config.json';
const REGION = process.env.REACT_APP_AWS_REGION;

export const authUser = async (username, password) => {
    const CLIENTID = process.env.REACT_APP_COGCLIENT;

    const cognitoIdpClient = new CognitoIdentityProviderClient({region: REGION});
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
        console.log(initAuthResp.AuthenticationResult.TokenType);
        return initAuthResp.AuthenticationResult;
    }catch(err){
        console.log(err);
        return err;
    }
}

