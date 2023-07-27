import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import axios from 'axios'

const REGION = process.env.REACT_APP_AWS_REGION;
const DB_APIurl = process.env.REACT_APP_DB_API_URL;
const OTP_APIurl = process.env.REACT_APP_OTP_API_URL;

export const handler = async(event) => {
    console.log(event.Records[0].dynamodb);
    if(!event.Records[0].dynamodb.NewImage || !event.Records[0].dynamodb.OldImage) {console.log('[ERROR]: missing newimg or missing oldimg'); return;}
    
    const newImg = event.Records[0].dynamodb.NewImage;
    const oldImg = event.Records[0].dynamodb.OldImage;
    
    const adminemail = '';
    const inconclusiveBodyText = '';
    const completeBodyText = 'placeholder - the results of your sample are ready';
    
    try{
        const newStatus = newImg['status'].S;
        const oldStatus = oldImg['status'].S;
        
        if(oldStatus == newStatus) {console.log('[ERROR]: no status change'); return;}
        console.log('statuses are different');
        if(newStatus == 'Inconclusive') sendSES(adminemail, 'Alert - Test is Inconclusive', inconclusiveBodyText)
        console.log('status is not inconclusive');
        if(newStatus != 'Complete') {console.log('[ERROR]: invalid status'); return;}
        console.log('checking users table');
        
        const userTableResp = await axios.get(DB_APIurl + `/users?tableName=harm_reduction_users&sample-id=${newImg['sample-id'].S}`);
        console.log(userTableResp.data);
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
        let expirytime = Date.now() + 5 * 60 * 1000
        const userTablePurgeResp = await axios.put(DB_APIurl + `/users?tableName=harm_reduction_users`, {
            "sample-id" : userTableResp.data['sample-id'],
            "contact" : userTableResp.data['contact'],
            "purge": expirytime
        });
        console.log(userTablePurgeResp.data);
            
        return sendMsgResp;
    }catch(err){
        console.log(err);
        return err;
    }
    
};

async function sendSES(recipient, subject, message){
    const CHARSET      = 'UTF-8' 
    const SENDER       = 'muhanli.work@gmail.com'
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
        console.log(sendEmailResp);
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