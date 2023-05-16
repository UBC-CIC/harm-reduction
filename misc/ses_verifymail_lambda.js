import { SESClient, VerifyEmailIdentityCommand } from "@aws-sdk/client-ses"

export const handler = async(event) => {
    let email;

    if(event.email) email = event.email;

    const ses = new SESClient({
        region: 'us-west-2'
    });

    const verifyEmailIdentity = new VerifyEmailIdentityCommand({
        EmailAddress: email
    })
    
    try{
        const resp = await ses.send(verifyEmailIdentity)
        console.log(resp);

        return{
            statuscode: 200,
            body: 'SUCCESS'
        }
    }catch(err){
        console.log(err)
        return{
            statuscode: 400,
            body: err
        }
    }
}