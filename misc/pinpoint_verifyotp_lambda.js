import { PinpointClient, VerifyOTPMessageCommand } from "@aws-sdk/client-pinpoint"; 

export const handler = async(event) => {
    const APP_ID    = ''; //process.env.APP_ID

    let   Recipient = '+17786808519';
    let   OtpCode   = '';
    let   RefId     = '';


    const ppClient = new PinpointClient({
        region: 'us-west-2'
    });

    const verifyOTPCmd = new VerifyOTPMessageCommand({
        ApplicationId: APP_ID,
        VerifyOTPMessageRequestParameters: {
            DestinationIdentity: Recipient,
            Otp: OtpCode,
            ReferenceId: RefId
        }
    });

    try{
        const verifyOTPResp = await ppClient.send(verifyOTPCmd);
        console.log(verifyOTPResp);

        return {
            statuscode: 200,
            body: verifyOTPResp
        }
    }catch(err){
        console.log(err);
        return {
            statuscode: 400,
            body: err
        }
    }
}