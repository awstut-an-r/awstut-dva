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
const REGION = "ap-northeast-1";
const USER_POOL_ID = "ap-northeast-1_vZHz15Bo5";
const IDENTITY_POOL_ID = "ap-northeast-1:a0102e09-b7e3-4e2b-9da3-e8b33c5f5088";
const FUNCTION_NAME_AUTHENTICATED = "dva-03-003-AuthenticatedFunction";
const FUNCTION_NAME_UNAUTHENTICATED = "dva-03-003-UnauthenticatedFunction";
//const ACCOUNT_ID = "ACCOUNT_ID";

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

console.log(lambdaClient);
console.log(functionName);

(async () => {
  const response = await lambdaClient.send(
    new InvokeCommand({ FunctionName: functionName })
  );
  console.log(response);
  document.getElementById("function-result").innerText = toUtf8(response.Payload);
})();

