import {
  CognitoIdentityClient
} from "@aws-sdk/client-cognito-identity";

import {
  fromCognitoIdentityPool
} from "@aws-sdk/credential-provider-cognito-identity";

import {
  LambdaClient,
  InvokeCommand
} from "@aws-sdk/client-lambda";

import {
  toUtf8
} from "@aws-sdk/util-utf8-browser";


// Set the parameter
const REGION = "[region]";
const USER_POOL_ID = "[user-pool-id]";
const IDENTITY_POOL_ID = "[id-pool-id]";
const FUNCTION_NAME_AUTHENTICATED = "[function-name-01]";
const FUNCTION_NAME_UNAUTHENTICATED = "[function-name-02]";

const params = new URLSearchParams(location.hash.slice(1));
const idToken = params.get("id_token");

let lambdaClient;
let functionName;
if (idToken) {
  lambdaClient = new LambdaClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken
      }
    }),
  });
  functionName = FUNCTION_NAME_AUTHENTICATED;
} else {
  lambdaClient = new LambdaClient({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: REGION }),
      identityPoolId: IDENTITY_POOL_ID
    }),
  });
  functionName = FUNCTION_NAME_UNAUTHENTICATED;
}

(async () => {
  const response = await lambdaClient.send(
    new InvokeCommand({ FunctionName: functionName })
  );
  console.log(response);
  document.getElementById("function-result").innerText = toUtf8(response.Payload);
})();

