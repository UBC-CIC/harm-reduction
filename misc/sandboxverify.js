import { SNSClient, VerifySMSSandboxPhoneNumberCommand } from "@aws-sdk/client-sns";

export const handler = async(event) => {
    let recipient = '+17786808519';
    let otpCode   = '123456';

    const snsClient = new SNSClient({region: 'us-west-2'});
    const verifyNumCMD = new VerifySMSSandboxPhoneNumberCommand({
        PhoneNumber: recipient,
        OneTimePassword: otpCode, 
    });

    try{
        const verifyNumResp = await snsClient.send(verifyNumCMD);
        console.log(verifyNumResp);
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
};
