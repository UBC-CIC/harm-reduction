import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"; // ES Modules import
// const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses"); // CommonJS import

export const handler = async(event) => {
    const CHARSET = 'UTF-8'
    let   sender;
    let   recipient;
    let   content_text;
    let   content_html;
    let   subject;

    const SESClient = new SESClient({
        region: 'us-west-2'
    });

    const sendMailInput = {
        Source: sender,
        Destination: {ToAddresses: [recipient]},
        Message: { 
            Subject: { 
                Data: subject,
                Charset: CHARSET
            },
            Body: { 
                Text: {
                    Data: content_text,
                    Charset: CHARSET
                },
                Html: {
                    Data: content_html,
                    Charset: CHARSET
                },
            },
        },
    }

    try{
        const sendEmail = new SendEmailCommand(sendMailInput);
        const sendMailResp = await SESClient.send(sendEmail);
        console.log(sendMailResp);

        return{
            statuscode: 200,
            body: "SUCCESS"
        }
    }catch(err){
        return{
            statuscode: 400,
            body: err
        }
    }
}