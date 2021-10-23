import json
import boto3
import datetime
import json

TABLE_NAME = 'dva-01-001-Table'
REGION_NAME = 'ap-northeast-1'

def lambda_handler(event, context):
    now = datetime.datetime.now()
    now_str = now.strftime('%Y-%m-%d %H:%M:%S')
    
    dynamodb_config = {
        'region_name': REGION_NAME
    }
    dynamodb = boto3.resource('dynamodb', **dynamodb_config)
    table = dynamodb.Table(TABLE_NAME)
    
    table.put_item(Item={
        'dt': now_str
    })
    
    result = table.scan()

    return {
        "statusCode": 200,
        "body": json.dumps(
            {"AccessDatetime": result},
            indent=2
        )
    }
