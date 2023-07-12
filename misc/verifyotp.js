import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

export const handler = async(event) => {
    const TABLE        = 'OTPTestTable';
    const dynamoClient = new DynamoDBClient({region:'us-west-2'});

    let   recipient    = '';
    let   userOTP      = '';
    let   userRefID    = '';

    if(event.recipient) recipient = event.recipient;
    if(event.userOTP)   userOTP   = event.userOTP;
    if(event.userRefID) userRefID = event.userRefID;

    try{
        const getItemCMD = new GetItemCommand({
            TableName: TABLE,
            Key: {
                "recipient": {S: recipient}
            }
        })
        const getItemResp = await dynamoClient.send(getItemCMD);
        console.log(getItemResp.Item);
        
        let actualOTP   = getItemResp.Item.OTP.S;
        let actualRefID = getItemResp.Item.refID.S;
        
        return{valid: ((actualOTP==userOTP) && (actualRefID==userRefID))}
    }catch(err){
        return{err}
    }
}