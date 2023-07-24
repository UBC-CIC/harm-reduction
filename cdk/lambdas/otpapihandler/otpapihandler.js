import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const headers = {
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": "http://localhost:3000",
  //"Access-Control-Allow-Origin": "https://no-config.d1wvjo9x2tn2e7.amplifyapp.com/Track",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}

export const handler = async(event) => {
    const { httpMethod, path, body } = event;
    console.log(httpMethod);
    console.log(body);
    const action = event.queryStringParameters['action'];
    console.log(action);
    const params = JSON.parse(body);
    
    if(action === 'send') return generateAndSendOTP(params);
    else if(action === 'verify') return verifyOTP(params);
    
    return {
        statusCode: 200, 
        headers: headers
    }
}

async function verifyOTP(params){
    const TABLE        = 'otptable';
    const dynamoClient = new DynamoDBClient({region:'us-west-2'});
    
    try{
        let recipient = params.recipient;
        let userOTP   = params.userOTP;
        let userRefID = params.userRefID;
        
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
        
        let body = {valid: (actualOTP==userOTP) && (actualRefID==userRefID)};
        
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(body)
        }
    }catch(err){
        return{
            statusCode: 400,
            headers: headers,
            body: JSON.stringify(err)
        }
    }
}

async function generateAndSendOTP(params){
    const TABLE          = 'otptable';
    const SUBJECT        = 'OTP - DO NOT REPLY'
    let   OTPCode        = Math.random().toString(36).substring(2, 8).toUpperCase(); 
    let   refID          = new Date().getTime().toString();

    const dynamoClient = new DynamoDBClient({region: 'us-west-2'});
    const OTPMessage   = `UBC Harm Reduction: your OTP is ${OTPCode}`
    console.log(OTPMessage);

    try{
        let recipient      = params.recipient;
        let contactbyemail = params.contactbyemail;
        let expirytime     = Date.now() + 5 * 60 * 1000;
        
        const putitemCMD = new PutItemCommand({
            TableName: TABLE, 
            Item: {
                "recipient": {S: recipient},
                "OTP": {S: OTPCode},
                "refID": {S: refID},
                "expiry": {N: expirytime}
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

        const body = {
            recipient: recipient,
            refID: refID
        }
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(body)
        }
    }catch(err){
        console.log(err);
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify(err)
        }
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
        console.log(err);
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
        const verifyNumResp = await snsClient.send(sendTextCMD);
        console.log(verifyNumResp);
        return true
    }catch(err){
        console.log(err);
        return false
    }
}