import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import config from 'config.json'

const SMSSendOTP = async (recipient) => {
    const SMSSENDOTPLAMBDA = config.SMSSENDOTP;

    const lambdaClient = new LambdaClient({
        region: 'us-west-2'
    });

    let referenceID = Math.random().toString(36).substring(2).toUpperCase();

    const sendOTPCMD = new InvokeCommand({
        FunctionName: SMSSENDOTPLAMBDA,
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

const EmailSendOTP = async () => {

    
}

export default {SMSSendOTP, EmailSendOTP}