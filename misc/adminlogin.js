import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export const handler = async(event) => {
    const cognitoIdpClient = new CognitoIdentityProviderClient({region: 'us-west-2'});
    const initAuthCMD = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH", //"USER_SRP_AUTH" || "REFRESH_TOKEN_AUTH" || "REFRESH_TOKEN" || "CUSTOM_AUTH" || "ADMIN_NO_SRP_AUTH" || "USER_PASSWORD_AUTH" || "ADMIN_USER_PASSWORD_AUTH", // required
        AuthParameters: { 
            "<keys>": "STRING_VALUE",
        },
        ClientId: "STRING_VALUE", // required
    })

    try{

    }catch(err){

    }
}