import base64
import boto3
import json
import os
import urllib.parse


REGION = os.environ['REGION']

get_html_template = """<html>
<head>
</head>
<body>
  <h1>Signup Page</h1>
  <form method="post" action="signup">
    Email: <input name="email"><br>
    Name: <input name="name"><br>
    Password: <input type="password" name="password"><br>
    Age: <input name="age"><br>
    <button>submit</button>
  </form>
</body>
</html>"""

post_html_template = """<html>
<head>
</head>
<body>
  <h1>Result Page</h1>
  <p>{email}</p>
  <p>{name}</p>
  <p>{age}</p>
  <p>Verification code was sent to your email address.</p>
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
        
        email = params['email'][0]
        name = params['name'][0]
        password = params['password'][0]
        age = params['age'][0]
        
        client = boto3.client('cognito-idp', region_name=REGION)

        response = client.sign_up(
            ClientId=os.environ['COGNITO_USERPOOL_CLIENT_ID'],
            Username=name,
            Password=password,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'custom:age', 'Value': str(age)}
            ])
        
        html = post_html_template.format(
          email=email, name=name, age=age)
          
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
