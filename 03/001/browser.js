import {
  CognitoIdentityClient,
  GetIdCommand
} from "@aws-sdk/client-cognito-identity";

import {
  fromCognitoIdentityPool
} from "@aws-sdk/credential-provider-cognito-identity";

import {
  CognitoSyncClient,
  ListRecordsCommand,
  UpdateRecordsCommand
} from "@aws-sdk/client-cognito-sync";


// Set the parameter
const REGION = "[region]";
const USER_POOL_ID = "[user-pool-id]";
const IDENTITY_POOL_ID = "[id-pool-id]";
const DATASET = "preference";
const DATASET_KEY = "background-color";

const params = new URLSearchParams(location.hash.slice(1));
const idToken = params.get("id_token");

const cognitoIdentityClient = new CognitoIdentityClient({ region: REGION });
const cognitoSyncClient = new CognitoSyncClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: cognitoIdentityClient,
    identityPoolId: IDENTITY_POOL_ID,
    logins: {
      [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken
    }
  })
});

const main = async () => {
  try {
    const response = await cognitoIdentityClient.send(
      new GetIdCommand({
        IdentityPoolId: IDENTITY_POOL_ID,
        Logins: {
          [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken
        }
      })
    );
    
    const identityId = response.IdentityId;
    const setBackgroundColorToCognitoSyncDataset = async (color) => {
      const listRecordsResponse = await cognitoSyncClient.send(
        new ListRecordsCommand({
          DatasetName: DATASET,
          IdentityId: identityId,
          IdentityPoolId: IDENTITY_POOL_ID
        })
      );
      const syncSessionToken = listRecordsResponse.SyncSessionToken;
      const syncCount = (() => {
        for (let record of listRecordsResponse.Records) {
          if (record.Key == DATASET_KEY) {
            return record.SyncCount + 1;
          }
        }
        return 0;
      })();
      
      const response = await cognitoSyncClient.send(
        new UpdateRecordsCommand({
          DatasetName: DATASET,
          IdentityId: identityId,
          IdentityPoolId: IDENTITY_POOL_ID,
          RecordPatches: [{
            Key: DATASET_KEY,
            Op: "replace",
            SyncCount: syncCount,
            Value: color
          }],
          SyncSessionToken: syncSessionToken
        })
      );
      document.body.style.background = color;
    };
    
    const getBackgroundColorFromCognitoSyncDataset = async () => {
      const listRecordsResponse = await cognitoSyncClient.send(
        new ListRecordsCommand({
          DatasetName: DATASET,
          IdentityId: identityId,
          IdentityPoolId: IDENTITY_POOL_ID
        })
      );
      
      for (let record of listRecordsResponse.Records) {
        if (record.Key == DATASET_KEY) {
          document.body.style.background = record.Value;
          break;
        }
      }
    };
      
    window.setBackgroundColorToCognitoSyncDataset = setBackgroundColorToCognitoSyncDataset;
    window.getBackgroundColorFromCognitoSyncDataset = getBackgroundColorFromCognitoSyncDataset;
    
    document.getElementById("button-set").addEventListener("click", function(event) {
      var color = document.getElementById("background-color").value;
      setBackgroundColorToCognitoSyncDataset(color);
    });
    
    document.getElementById('button-get').addEventListener('click', function(event) {
      getBackgroundColorFromCognitoSyncDataset();
    });
  } catch (err) {
    console.log(err);
  }
  
  // get username
  try {
    const tokens = idToken.split('.');
    const tokenDecoded = JSON.parse(atob(tokens[1]));
    document.getElementById('name').innerText = `Name: ${tokenDecoded.name}`;
  } catch (err) {
    console.log(err);
    document.getElementById('name').innerText = 'Name: Guest';
  }
};

main();


