import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const REGION = process.env.AWS_REGION;
const SENDER = process.env.EMAIL_ADDRESS;
const TABLE  = process.env.OTP_TABLE;

const headers = {
  "Access-Control-Allow-Headers" : "Content-Type, x-api-key",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}

export const handler = async(event) => {
    const { httpMethod, path, body } = event;
    const action = event.queryStringParameters['action'];
    const params = JSON.parse(body);
    
    if(httpMethod === 'OPTIONS'){
        return {
            statusCode: 204,
            headers: headers,
            body: JSON.stringify({ message: 'No content' }),
        }
    }
    
    if(action === 'send') return generateAndSendOTP(params);
    else if(action === 'verify') return verifyOTP(params);
    
    return {
        statusCode: 200, 
        headers: headers
    }
}

async function verifyOTP(params){
    const dynamoClient = new DynamoDBClient({region:REGION});
    
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
    const SUBJECT        = 'OTP - DO NOT REPLY'
    let   OTPCode        = Math.random().toString(36).substring(2, 8).toUpperCase(); 
    let   refID          = new Date().getTime().toString();

    const dynamoClient = new DynamoDBClient({region: REGION});
    const OTPMessage   = `UBC Harm Reduction: your OTP is ${OTPCode}`

    try{
        let recipient      = params.recipient;
        let contactbyemail = params.contactbyemail;
        let expirytime     = Math.floor((Date.now()/1000) + 5 * 60).toString();
        
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
        
        let sendMsgResp;
        if(contactbyemail) sendMsgResp = await sendSES(recipient, SUBJECT, OTPMessage);
        else               sendMsgResp = await sendSNS(recipient, SUBJECT, OTPMessage);

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
    const sesClient    = new SESClient({region: REGION});
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
        return true
    }catch(err){
        console.log(err);
        return false
    }
}

async function sendSNS(recipient, subject, message){
    const snsClient = new SNSClient({region: REGION});
    const sendTextCMD = new PublishCommand({
        PhoneNumber: recipient,
        Message: message,
        Subject: subject,
    })

    try{
        const verifyNumResp = await snsClient.send(sendTextCMD);
        return true
    }catch(err){
        console.log(err);
        return false
    }
}