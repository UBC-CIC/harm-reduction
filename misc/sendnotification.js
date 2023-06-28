import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import axios from 'axios'

export const handler = async(event) => {
    const oldImg = event.Records[0].dynamodb.OldImage;
    const newImg = event.Records[0].dynamodb.NewImage;
    const adminemail = '';
    
    console.log(oldImg);
    console.log(newImg);
    
    if(oldImg['test-results'] == newImg['test-results']) return;
    const inconclusiveBodyText = '';
    if(newImg['test-results'] == 'Inconclusive') sendSES(adminemail, 'Alert - Test is Inconclusive', inconclusiveBodyText)
    if(newImg['test-results'] != 'Complete')  return;
    
    try{
        const userTableResp = axios.get(`https://1pgzkwt5w4.execute-api.us-west-2.amazonaws.com/test/users?tableName=users&sample-id=${newImg['sample-id']}`);
        console.log(userTableResp.data);
        const contact = userTableResp.data.contact;
        
        const completeBodyText = '';
        if(checkEmailOrPhone(contact) == 'neither') return;
        const sendMsgResp = (checkEmailOrPhone(contact) == 'email') ? 
            sendSES(contact, 'Update from UBC Harm Reduction', completeBodyText) : 
            sendSNS(contact, 'Update from UBC Harm Reduction', completeBodyText);
            
        return sendMsgResp;
    }catch(err){
        console.log(err);
        return err;
    }
    
};

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
        const verifyNumResp = await snsClient.send(sendTextCMD);
        console.log(verifyNumResp);
        return true
    }catch(err){
        return false
    }
}

function checkEmailOrPhone(string) {
    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    const phonePattern = /^(\+\d{1,3}\s?)?(\(\d{1,4}\)|\d{1,4})[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

    if(emailPattern.test(string)) return 'email';
    if(phonePattern.test(string)) return 'phone';
    return 'neither'
}