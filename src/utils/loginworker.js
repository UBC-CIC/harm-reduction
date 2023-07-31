import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

const REGION = process.env.REACT_APP_AWS_REGION;

export const authUser = async (username, password) => {
    const CLIENTID = process.env.REACT_APP_COGCLIENT;

    const cognitoIdpClient = new CognitoIdentityProviderClient({region: REGION});
    const initAuthCMD = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: { 
            "USERNAME": username,
            "PASSWORD": password
        },
        ClientId: CLIENTID,
    })

    try{
        const initAuthResp = await cognitoIdpClient.send(initAuthCMD);
        return initAuthResp.AuthenticationResult;
    }catch(err){
        console.log(err);
        return err;
    }
}

