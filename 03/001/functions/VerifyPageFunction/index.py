import base64
import boto3
import json
import os
import pprint
import urllib.parse


REGION = os.environ['REGION']

get_html_template = """<html>
<head>
</head>
<body>
  <h1>Verify Page</h1>
  <form method="post" action="verify">
    Name: <input name="name"><br>
    Verification code: <input name="verification-code"><br>
    <button>submit</button>
  </form>
</body>
</html>"""

post_html_template = """<html>
<head>
</head>
<body>
  <h1>Result Page</h1>
  <p>Verified Successfully.</p>
</body>
</html>"""

def lambda_handler(event, context):
    method = event['requestContext']['http']['method'] 
    
    html = ''
    if method == 'GET':
        html = get_html_template
      
    elif method == 'POST':
        body_decoded = base64.b64decode(event['body']).decode()
        params = urllib.parse.parse_qs(body_decoded)
        
        name = params['name'][0]
        verification_code = params['verification-code'][0]
        
        client = boto3.client('cognito-idp', region_name=REGION)
        
        try:
            response = client.confirm_sign_up(
                ClientId=os.environ['COGNITO_USERPOOL_CLIENT_ID'],
                Username=name,
                ConfirmationCode=verification_code
                )
                
            pprint.pprint(response)
            html = post_html_template
        except:
            # when verification code is invalid.
            pass
        
    else:
        # Throw Exception and return Error page.
        pass
    
    return {
        'statusCode': 200,
        "isBase64Encoded": False,
        'headers': {
            'Access-Control-Allow-Origin': '"*"',
            'Content-Type': 'text/html; charset=utf-8'
            },
        'body': html
    }
