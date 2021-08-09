import base64
import boto3
import json
import os
import pprint
import urllib.parse
from jinja2 import Template


REGION = os.environ['REGION']

get_html_template = """<html>
<head>
</head>
<body>
  <h1>Signin Page</h1>
  <form method="post" action="signin">
    Email: <input name="email"><br>
    Password: <input type="password" name="password"><br>
    <button>submit</button>
  </form>
</body>
</html>"""

post_html_template = Template("""<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/aws-sdk/2.961.0/aws-sdk.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/amazon-cognito-js@1.1.0/dist/amazon-cognito.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/amazon-cognito-identity-js@5.0.6/dist/amazon-cognito-identity.min.js"></script>
</head>
<body>
  <h1>Personal Page</h1>
  <h2>UserPool Attributes</h2>
  <p>Username: {{username}}</p>
  <p>Age: {{age}}</p>
  
  <h2>Cognito Sync Test</h2>
  <form>
    background-color: <input type="text" id="background-color">
    <button type="button" id="button-set">set background-color</button>
  </form>
  <button type="button" id="button-get">get background-color</button>
  
  <script>
    AWS.config.region = '{{region}}';
  
    var userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: '{{cognito_userpool_id}}',
      ClientId: '{{cognito_userpool_client_id}}'
    });
    //console.log(userPool);
  
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: '{{email}}',
      Pool: userPool
    });
    //console.log(cognitoUser);
    
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: '{{email}}',
      Password: '{{password}}'
    });
    //console.log(authenticationDetails);
    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        //console.log(result);
        var idToken = result.getIdToken().getJwtToken();
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: '{{cognito_identity_pool_id}}',
          Logins: {
            ['cognito-idp.{{region}}.amazonaws.com/{{cognito_userpool_id}}']: idToken
          }
        });
      },
      
      onFailure: function(err) {
        console.log(err)
      }
    });
    
    var setBackgroundColorToCognitoSync = function(color) {
      AWS.config.credentials.get(function() {
        var syncClient = new AWS.CognitoSyncManager();
        syncClient.openOrCreateDataset('preference', function(err, dataset) {
          dataset.put('background-color', color, function(err, record) {
            dataset.synchronize({
              onSuccess: function(data, newRecords) {
                document.body.style.background = color;
              }
            });
          });
        });
      });
    };
    
    var getBackgroundColorFromCognitoSync = function() {
      AWS.config.credentials.get(function() {
        var syncClient = new AWS.CognitoSyncManager();
        syncClient.openOrCreateDataset('preference', function(err, dataset) {
          dataset.get('background-color', function(err, record) {
            dataset.synchronize({
              onSuccess: function(data, newRecords) {
                document.body.style.background = record;
              }
            });
          });
        });
      });
    };
    
    document.getElementById('button-set').addEventListener('click', function(event) {
      var color = document.getElementById('background-color').value;
      setBackgroundColorToCognitoSync(color);
    });
    
    document.getElementById('button-get').addEventListener('click', function(event) {
      getBackgroundColorFromCognitoSync();
    });
  </script>
</body>
</html>""")

def lambda_handler(event, context):
    method = event['requestContext']['http']['method'] 
    
    html = ''
    if method == 'GET':
        html = get_html_template
      
    elif method == 'POST':
        body_decoded = base64.b64decode(event['body']).decode()
        params = urllib.parse.parse_qs(body_decoded)
        
        email = params['email'][0]
        password = params['password'][0]
        
        client = boto3.client('cognito-idp', region_name=REGION)
        
        username = ''
        age = ''
        
        try:
            user_response = client.admin_get_user(
                UserPoolId=os.environ['COGNITO_USERPOOL_ID'],
                Username=email)

            username = user_response['Username']
            for attributes in user_response['UserAttributes']:
                if attributes['Name'] == 'custom:age':
                    age = attributes['Value']
                    break
            
        except Exception as e:
            print(e)
            pass
            
        html = post_html_template.render(
            username=username,
            password=password,
            email=email,
            age=age,
            region=REGION,
            cognito_userpool_id=os.environ['COGNITO_USERPOOL_ID'],
            cognito_userpool_client_id=os.environ['COGNITO_USERPOOL_CLIENT_ID'],
            cognito_identity_pool_id=os.environ['COGNITO_IDENTITY_POOL_ID'])
        
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
