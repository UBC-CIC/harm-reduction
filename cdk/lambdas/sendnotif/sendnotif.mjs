import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import axios from 'axios'

const REGION = process.env.AWS_REGION;
const DB_APIurl = process.env.DB_API_URL;
const ADMIN_EMAIL = process.env.EMAIL_ADDRESS;

export const handler = async(event) => {
    console.log(event.Records[0].dynamodb);
    if(!event.Records[0].dynamodb.NewImage || !event.Records[0].dynamodb.OldImage) {console.log('[ERROR]: missing newimg or missing oldimg'); return;}
    
    const newImg = event.Records[0].dynamodb.NewImage;
    const oldImg = event.Records[0].dynamodb.OldImage;
    
    const inconclusiveBodyText = '';
    const completeBodyText = 'placeholder - the results of your sample are ready';
    
    try{
        const newStatus = newImg['status'].S;
        const oldStatus = oldImg['status'].S;
        
        if(oldStatus == newStatus) {console.log('[ERROR]: no status change'); return;}
        console.log('statuses are different');
        if(newStatus == 'Inconclusive') sendSES(ADMIN_EMAIL, 'Alert - Test is Inconclusive', inconclusiveBodyText)
        console.log('status is not inconclusive');
        if(newStatus != 'Complete') {console.log('[ERROR]: invalid status'); return;}
        console.log('checking users table');
        
        const userTableResp = await axios.get(DB_APIurl + `users?sample-id=${newImg['sample-id'].S}`);
        const contact = userTableResp.data.contact;
        
        if(checkEmailOrPhone(contact) == 'neither') {console.log('[ERROR]: invalid contact'); return;}
        let sendMsgResp = 'null';
        if(checkEmailOrPhone(contact) == 'email'){
            console.log('EMAIL');
            sendMsgResp = await sendSES(contact, 'Update from UBC Harm Reduction', completeBodyText);
        }
        else{
            console.log('PHONE');
            sendMsgResp = await sendSNS(contact, 'Update from UBC Harm Reduction', completeBodyText);
        }
        let expirytime = Math.floor((Date.now()/1000) + 5 * 60).toString();
        const userTablePurgeResp = await axios.put(DB_APIurl + `users`, {
            "sample-id" : userTableResp.data['sample-id'],
            "contact" : userTableResp.data['contact'],
            "purge": expirytime
        });
            
        return sendMsgResp;
    }catch(err){
        console.log(err);
        return err;
    }
    
};

async function sendSES(recipient, subject, message){
    const CHARSET      = 'UTF-8' 
    const sesClient    = new SESClient({region: REGION});
    const sendEmailCMD = new SendEmailCommand({
        Source: ADMIN_EMAIL,
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