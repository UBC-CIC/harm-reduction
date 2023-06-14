import { LambdaClient, InvokeCommand, Lambda } from "@aws-sdk/client-lambda";
import { toUtf8 } from "@aws-sdk/util-utf8";

import config from '../config.json';

export const authUser = async (username, password) => {
    const INITAUTHLAMBDA = 'initauth-test';
    // const COGCLIENTID = '';

    const credentials = {
        accessKeyId: config.ID,
        secretAccessKey: config.Key
    }

    const lambdaClient = new LambdaClient({
        region: 'us-west-2', 
        credentials: credentials
    });

    const initAuthCMD  = new InvokeCommand({
        FunctionName: INITAUTHLAMBDA,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: JSON.stringify({
            username: username,
            password: password 
        })
    });

    try{
        const initAuthResp = await lambdaClient.send(initAuthCMD);
        let respPayload = JSON.parse(toUtf8(initAuthResp.Payload));
        console.log(respPayload);

        return respPayload;
    }catch(err){
        console.log(err);
        return err;
    }
}

