import { PinpointClient, SendOTPMessageCommand } from "@aws-sdk/client-pinpoint"; 

export const handler = async(event) => {
  const APP_ID = '72958d7e11914769b7c0a8dd6063dfd8'; // process.env.APP_ID
  const MAX_ATTEMPTS = 3;
  const CODE_LENGTH = 6;
  const VALIDITY_PERIOD = 15;
  const ORIGINATION = "+12363014807"; //process.env.ORIGINATION

  let   recipient = '+17786808519';
  let   referenceID = 'test-reference';

  if(event.recipient)   recipient   = event.recipient;
  if(event.referenceID) referenceID = event.referenceID;

  const ppClient = new PinpointClient({
    region: 'us-west-2'
  });

  const sendOTPCmd = new SendOTPMessageCommand({
    ApplicationId: APP_ID, 
    SendOTPMessageRequestParameters: {
      AllowedAttempts: Number(MAX_ATTEMPTS),
      BrandName: "UBC HARM REDUCTION", 
      Channel: "SMS", 
      CodeLength: Number(CODE_LENGTH),
      DestinationIdentity: recipient, // required
      OriginationIdentity: ORIGINATION, // required
      ReferenceId: referenceID, // required
      ValidityPeriod: Number(VALIDITY_PERIOD),}
  })

  try{
    const sendOTPResp = await ppClient.send(sendOTPCmd);
    console.log(sendOTPResp);

    return{ 
      statuscode: 200,
      body: sendOTPResp
    }
  }catch(err){
    console.log(err);

    return{
      statuscode: 400,
      body: err
    }
  }
}