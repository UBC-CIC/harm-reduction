import json
import boto3

from botocore.exceptions import ClientError

def lambda_handler(event, context):

    SENDER = 'alanli8519@gmail.com'
    RECIPIENT = 'alanli8519@gmail.com'
    SUBJECT = 'TEST'
    BODY_TEXT = 'TEST BODY'
    BODY_HTML = ''
    CHARSET = "UTF-8"
    AWS_REGION = 'us-west-2'
    
    SESclient = boto3.client('ses',region_name=AWS_REGION)
    
    try:
        resp = SESclient.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
        )
    except ClientError as e:
        return {
            'statusCode' : 400,
            'body' : json.dumps(e)
        }
    else:
        return {
            'statusCode' : 200,
            'body' : json.dumps('SUCCESS')
        }
