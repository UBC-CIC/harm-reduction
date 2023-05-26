import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
// import config from 'config.json'

export const SendOTP = async (recipient, contactbyemail) => {
    const SMSSENDOTPLAMBDA  = 'test-sendotp'; //config.SMSSENDOTP;
    const EMAILSENDOTPLAMBDA = ''; // config

    const lambdaClient = new LambdaClient({
        region: 'us-west-2'
    });

    let referenceID = Math.random().toString(36).substring(2).toUpperCase();
    let functionName = contactbyemail ? EMAILSENDOTPLAMBDA : SMSSENDOTPLAMBDA ;

    const sendOTPCMD = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: {
            recipient: recipient,
            referenceID: referenceID
        }
    });

    try{
        const resp = await lambdaClient.send(sendOTPCMD);
        console.log(resp);

        return{
            referenceID: ''
        }
    }catch(err){
        console.log(err);
        return {
            err: err
        }
    }
    
}

export const VerifyOTP = async (recipient, enteredOTP, referenceID, contactbyemail) => {
    const SMSVERIFYOTPLAMBDA  = ''; //config.SMSSENDOTP;
    const EMAILVERIFYOTPLAMBDA = ''; // config

    const lambdaClient = new LambdaClient({
        region: 'us-west-2'
    });

    let functionName = contactbyemail ? EMAILVERIFYOTPLAMBDA : SMSVERIFYOTPLAMBDA;

    const verifyOTPCMD = new InvokeCommand({
        FunctionName: functionName,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: {
            Recipient: recipient,
            OtpCode: enteredOTP,
            RefId: referenceID
        }
    });

    try{
        const resp = await lambdaClient.send(verifyOTPCMD);
        console.log(resp);
        return{
            valid: true // or false
        }
    }catch(err){
        console.log(err);
        // do something
    }
}