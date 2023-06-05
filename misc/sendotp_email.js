import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export const handler = async(event) => {
    const TABLE          = 'OTPTestTable';
    const SUBJECT        = 'OTP - DO NOT REPLY'

    let   OTPCode        = Math.random().toString(36).substring(2, 8).toUpperCase(); 
    
    let   contactbyemail = false;
    let   recipient      = '+17786808519';
    let   refID          = 'testref';

    if(event.contactbyemail) contactbyemail = event.contactbyemail;
    if(event.recipient)      recipient      = event.recipient;
    if(event.refID)          refID          = event.refID;

    const dynamoClient = new DynamoDBClient({region: 'us-west-2'});
    const OTPMessage   = `UBC Harm Reduction: your OTP is ${OTPCode}`
    
    console.log(OTPMessage);

    try{
        const putitemCMD = new PutItemCommand({
            TableName: TABLE, 
            Item: {
                "recipient": {S: recipient},
                "OTP": {S: OTPCode},
                "refID": {S: refID}
            },
            ReturnConsumedCapacity: "TOTAL",
        });
        const putitemResp = await dynamoClient.send(putitemCMD);
        console.log(putitemResp);
        
        console.log('sending message')
        let sendMsgResp;
        if(contactbyemail) sendMsgResp = await sendSES(recipient, SUBJECT, OTPMessage);
        else               sendMsgResp = await sendSNS(recipient, SUBJECT, OTPMessage);
        console.log(sendMsgResp);

        return {
            statuscode: 200,
            recipient: recipient,
            refID: refID
        }
    }catch(err){
        console.log(err);
        return err
    }
}

async function sendSES(recipient, subject, message){
    const CHARSET      = 'UTF-8' 
    const SENDER       = 'muhanli.work@gmail.com'
    const sesClient    = new SESClient({region: 'us-west-2'});
    const sendEmailCMD = new SendEmailCommand({
        Source: SENDER,
        Destination: {ToAddresses: [recipient]},
        Message: { 
            Subject: { 
                Data: subject,
                Charset: CHARSET
            },
            Body: { 
                Text: {
                    Data: message,
                    Charset: CHARSET
                }
            },
        },
    })

    try{
        const sendEmailResp = await sesClient.send(sendEmailCMD);
        console.log(sendEmailResp);
        return true
    }catch(err){
        return false
    }
}

async function sendSNS(recipient, subject, message){
    const snsClient = new SNSClient({region: 'us-west-2'});
    const sendTextCMD = new PublishCommand({
        PhoneNumber: recipient,
        Message: message,
        Subject: subject,
    })

    try{
        const sendTextResp = await snsClient.send(sendTextCMD);
        console.log(sendTextResp);
        return true
    }catch(err){
        return false
    }
}