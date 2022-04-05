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
const REGION = "ap-northeast-1";
const USER_POOL_ID = "ap-northeast-1_AwzK8hCv4";
const IDENTITY_POOL_ID = "ap-northeast-1:2ada5a79-724b-464f-927a-1e8f1f1a8059";
const DATASET = "preference";
const DATASET_KEY = "background-color";

const params = new URLSearchParams(location.hash.slice(1));
const idToken = params.get("id_token");

const cognitoIdentityClient = new CognitoIdentityClient({ region: REGION });
const cognitoSyncClient = new CognitoSyncClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    //client: new CognitoIdentityClient({ region: REGION }),
    client: cognitoIdentityClient,
    identityPoolId: IDENTITY_POOL_ID,
    logins: {
      [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken
    }
  })
});

const main = async () => {
  const response = await cognitoIdentityClient.send(
    new GetIdCommand({
      IdentityPoolId: IDENTITY_POOL_ID,
      Logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken
      }
    })
  );
  //console.log(response);
  
  const identityId = response.IdentityId;
  //console.log(identityId);
  
  const setBackgroundColorToCognitoSyncDataset = async (color) => {
    //console.log(identityId);
    try {
      const listRecordsResponse = await cognitoSyncClient.send(
        new ListRecordsCommand({
          DatasetName: DATASET,
          IdentityId: identityId,
          IdentityPoolId: IDENTITY_POOL_ID
        })
      );
      //console.log(listRecordsResponse);
      const syncSessionToken = listRecordsResponse.SyncSessionToken;
      const syncCount = (() => {
        for (let record of listRecordsResponse.Records) {
          console.log(record);
          if (record.Key == DATASET_KEY) {
            return record.SyncCount + 1;
          }
        }
        
        return 0;
      })();
      console.log(syncCount);
      
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
      //console.log(response);
      document.body.style.background = color;
    } catch (err) {
      console.log(err);
    }
  };
  
  const getBackgroundColorFromCognitoSyncDataset = async () => {
    const listRecordsResponse = await cognitoSyncClient.send(
      new ListRecordsCommand({
        DatasetName: DATASET,
        IdentityId: identityId,
        IdentityPoolId: IDENTITY_POOL_ID
      })
    );
    //console.log(listRecordsResponse);
    
    for (let record of listRecordsResponse.Records) {
      if (record.Key == DATASET_KEY) {
        document.body.style.background = record.Value;
        break;
      }
    }
  };
    
  window.setBackgroundColorToCognitoSyncDataset = setBackgroundColorToCognitoSyncDataset;
  window.getBackgroundColorFromCognitoSyncDataset = getBackgroundColorFromCognitoSyncDataset;
};

main();


document.getElementById("button-set").addEventListener("click", function(event) {
  var color = document.getElementById("background-color").value;
  //console.log(color);
  setBackgroundColorToCognitoSyncDataset(color);
});

document.getElementById('button-get').addEventListener('click', function(event) {
  getBackgroundColorFromCognitoSyncDataset();
});