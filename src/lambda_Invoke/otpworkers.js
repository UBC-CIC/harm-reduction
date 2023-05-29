import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
// import AwsCredentialIdentity from "@aws-sdk/types"
import config from '../config.json'
import { toUtf8 } from "@aws-sdk/util-utf8";

export const SendOTP = async (recipient, contactbyemail) => {
    const SMSSENDOTPLAMBDA  = 'test-sendotp'; //config.SMSSENDOTP;
    const EMAILSENDOTPLAMBDA = ''; // config

    const credentials = {
        accessKeyId: config.ID,
        secretAccessKey: config.Key
    }

    const lambdaClient = new LambdaClient({
        region: 'us-west-2', 
        credentials: credentials
    });

    let referenceID = Math.random().toString(36).substring(2).toUpperCase();
    let functionName = contactbyemail ? EMAILSENDOTPLAMBDA : SMSSENDOTPLAMBDA ;

    const sendOTPCMD = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: JSON.stringify({
            recipient: recipient,
            referenceID: referenceID
        })
    });

    try{
        const resp = await lambdaClient.send(sendOTPCMD);
        let respPayload = JSON.parse(toUtf8(resp.Payload));
        console.log(respPayload);

        return{
            body: respPayload, 
            referenceID: referenceID
        }
    }catch(err){
        console.log(err);
        return {
            err: err
        }
    }
    
}

export const VerifyOTP = async (recipient, enteredOTP, referenceID, contactbyemail) => {
    const SMSVERIFYOTPLAMBDA  = 'node-verifyotp'; //config.SMSSENDOTP;
    const EMAILVERIFYOTPLAMBDA = ''; // config

    const credentials = {
        accessKeyId: config.ID,
        secretAccessKey: config.Key
    }

    const lambdaClient = new LambdaClient({
        region: 'us-west-2', 
        credentials: credentials
    });

    let functionName = contactbyemail ? EMAILVERIFYOTPLAMBDA : SMSVERIFYOTPLAMBDA;

    const verifyOTPCMD = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: JSON.stringify({
            Recipient: recipient,
            OtpCode: enteredOTP,
            RefId: referenceID
        })
    });

    try{
        const resp = await lambdaClient.send(verifyOTPCMD);
        let respPayload = JSON.parse(toUtf8(resp.Payload));
        console.log(respPayload.body);
        //let respPayload = JSON.parse(toUtf8(resp.Payload));
        //console.log(respPayload);
        return{
            body: 'placeholder'
        }
    }catch(err){
        console.log(err);
        // console.log(err);
        // do something
    }
}