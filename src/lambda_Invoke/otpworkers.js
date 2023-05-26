import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
// import config from 'config.json'

export const SendOTP = async (recipient, contactbyemail) => {
    const SMSSENDOTPLAMBDA  = ''; //config.SMSSENDOTP;
    const EMAILSENDOTPLAMBDA = ''; // config

    const lambdaClient = new LambdaClient({
        region: 'us-west-2'
    });

    let referenceID = Math.random().toString(36).substring(2).toUpperCase();
    let functionName = contactbyemail ? SMSSENDOTPLAMBDA : EMAILSENDOTPLAMBDA;

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
            OTP: '',
            referenceID: ''
        }
    }catch(err){
        console.log(err);
        return {
            err: err
        }
    }
    
}

export const VerifyOTP = async (enteredOTP, referenceID, contactbyemail) => {
    
}