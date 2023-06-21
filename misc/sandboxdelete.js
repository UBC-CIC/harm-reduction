import { SNSClient, DeleteSMSSandboxPhoneNumberCommand } from "@aws-sdk/client-sns";

export const handler = async(event) => {
    let numToDelete = '+17786808519';

    const snsClient = new SNSClient({region: 'us-west-2'});
    const deleteNumCMD = new DeleteSMSSandboxPhoneNumberCommand({
        PhoneNumber: numToDelete,
    });

    try{
        const deleteNumResp = await snsClient.send(deleteNumCMD);
        console.log(deleteNumResp);
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}