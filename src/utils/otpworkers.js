import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
// import AwsCredentialIdentity from "@aws-sdk/types"
import config from '../config.json'
import { toUtf8 } from "@aws-sdk/util-utf8";

export const SendOTP = async (recipient, contactbyemail) => {
    const SENDOTPLAMBDA = 'generateandsendOTP';

    const credentials = {
        accessKeyId: config.ID,
        secretAccessKey: config.Key
    }

    const lambdaClient = new LambdaClient({
        region: 'us-west-2', 
        credentials: credentials
    });

    let referenceID = new String(new Date().getTime());

    const sendOTPCMD = new InvokeCommand({
        FunctionName: SENDOTPLAMBDA,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: JSON.stringify({
            contactbyemail: contactbyemail,
            recipient: recipient,
            refID: referenceID
        })
    });
    console.log(sendOTPCMD);

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

export const VerifyOTP = async (recipient, enteredOTP, referenceID) => {
    const VERIFYOTPLAMBDA = 'verifyOTP';

    const credentials = {
        accessKeyId: config.ID,
        secretAccessKey: config.Key
    }

    const lambdaClient = new LambdaClient({
        region: 'us-west-2', 
        credentials: credentials
    });

    console.log("destination: " + recipient);
    const verifyOTPCMD = new InvokeCommand({
        FunctionName: VERIFYOTPLAMBDA,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: JSON.stringify({
            recipient: recipient,
            userOTP: enteredOTP,
            userRefID: referenceID
        })
    });
    console.log(verifyOTPCMD);

    try{
        const resp = await lambdaClient.send(verifyOTPCMD);
        let respPayload = JSON.parse(toUtf8(resp.Payload));
        console.log(respPayload);
        return{
            valid: respPayload.valid
        }
    }catch(err){
        console.log(err);
        // console.log(err);
        // do something
    }
}